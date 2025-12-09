import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    increment,
    updateDoc,
    limit,
    arrayUnion,
    arrayRemove,
    where,
    getDocs
} from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';

import { auth, db } from './firebase';
import { THEME, generateAvatar } from './theme';
import { User, UserListItem, Transaction } from './types';

import Marquee from './components/Marquee';
import Onboarding from './components/Onboarding';
import CodenamePage from './components/CodenamePage';
import Header from './components/Header';
import Tabs, { TabType } from './components/Tabs';
import FloatingActionButton from './components/FloatingActionButton';
import AuraAction from './components/AuraAction';
import FeedTab from './components/tabs/FeedTab';
import LeaderboardTab from './components/tabs/LeaderboardTab';
import FriendsTab from './components/tabs/FriendsTab';
import ChatInterface from './components/ChatInterface';

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [usersList, setUsersList] = useState<UserListItem[]>([]);
    const [feed, setFeed] = useState<Transaction[]>([]);
    const [showAction, setShowAction] = useState(false);
    const [currentTab, setCurrentTab] = useState<TabType>('feed');
    const [loading, setLoading] = useState(true);
    const [needsCodename, setNeedsCodename] = useState(false);
    const [chatPartner, setChatPartner] = useState<UserListItem | null>(null);

    // --- AUTH & DATA SYNC ---
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (u) => {
            if (u) {
                const userDocRef = doc(db, 'users', u.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data() as User;
                    if (userData.handle) {
                        setUser({ ...userData, uid: u.uid });
                        setNeedsCodename(false);
                    } else {
                        setUser({ uid: u.uid, email: u.email || undefined });
                        setNeedsCodename(true);
                    }
                } else {
                    setUser({ uid: u.uid, email: u.email || undefined });
                    setNeedsCodename(true);
                }

                onSnapshot(userDocRef, (snap) => {
                    if (snap.exists()) {
                        const data = snap.data() as User;
                        if (data.handle) {
                            setUser({ ...data, uid: u.uid });
                            setNeedsCodename(false);
                        }
                    }
                });
            } else {
                setUser(null);
                setNeedsCodename(false);
            }
            setLoading(false);
        });

        return () => unsubAuth();
    }, []);

    // Fetch Users & Feed
    useEffect(() => {
        if (!user || !user.handle) return;

        const usersQ = query(collection(db, 'users'));
        const unsubUsers = onSnapshot(usersQ, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserListItem));
            setUsersList(list.sort((a, b) => b.aura - a.aura));
        }, (err) => console.log(err));

        const feedQ = query(
            collection(db, 'transactions'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const unsubFeed = onSnapshot(feedQ, (snap) => {
            setFeed(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
        }, (err) => console.log(err));

        return () => { unsubUsers(); unsubFeed(); };
    }, [user?.handle]);

    // --- HANDLERS ---
    const handleSetCodename = async (handle: string) => {
        if (!auth.currentUser) throw new Error('Not authenticated');

        const handleQuery = query(collection(db, 'users'), where('handle', '==', handle.toLowerCase()));
        const handleSnap = await getDocs(handleQuery);

        if (!handleSnap.empty) {
            throw new Error('This codename is already taken');
        }

        const uid = auth.currentUser.uid;
        const userData = {
            handle: handle.toLowerCase(),
            email: auth.currentUser.email || '',
            aura: 0,
            avatar: generateAvatar(handle),
            friends: [],
            friendRequests: [],
            sentRequests: [],
            joinedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', uid), userData);
        setUser({ ...userData, uid });
        setNeedsCodename(false);
    };

    const handleTransaction = async (targetId: string, amount: number, reason: string) => {
        if (!user || !user.handle) return;

        await addDoc(collection(db, 'transactions'), {
            senderId: user.uid,
            receiverId: targetId,
            amount,
            reason,
            createdAt: serverTimestamp()
        });

        await updateDoc(doc(db, 'users', targetId), {
            aura: increment(amount)
        });
    };

    const handleSendFriendRequest = async (targetId: string): Promise<{ type: string; msg: string }> => {
        if (!user) return { type: 'error', msg: 'Not logged in' };

        try {
            await updateDoc(doc(db, 'users', targetId), {
                friendRequests: arrayUnion(user.uid)
            });

            await updateDoc(doc(db, 'users', user.uid), {
                sentRequests: arrayUnion(targetId)
            });

            return { type: 'success', msg: 'Friend request sent!' };
        } catch {
            return { type: 'error', msg: 'Failed to send request' };
        }
    };

    const handleAcceptFriendRequest = async (fromUserId: string) => {
        if (!user) return;

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                friends: arrayUnion(fromUserId),
                friendRequests: arrayRemove(fromUserId)
            });

            await updateDoc(doc(db, 'users', fromUserId), {
                friends: arrayUnion(user.uid),
                sentRequests: arrayRemove(user.uid)
            });
        } catch (err) {
            console.error('Failed to accept request:', err);
        }
    };

    const handleDeclineFriendRequest = async (fromUserId: string) => {
        if (!user) return;

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                friendRequests: arrayRemove(fromUserId)
            });

            await updateDoc(doc(db, 'users', fromUserId), {
                sentRequests: arrayRemove(user.uid)
            });
        } catch (err) {
            console.error('Failed to decline request:', err);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!user) return;

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                friends: arrayRemove(friendId)
            });

            await updateDoc(doc(db, 'users', friendId), {
                friends: arrayRemove(user.uid)
            });
        } catch (err) {
            console.error('Failed to remove friend:', err);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white font-mono">
                LOADING_ASSETS...
            </div>
        );
    }

    if (!user) {
        return <Onboarding onAuthenticated={() => { }} />;
    }

    if (needsCodename) {
        return <CodenamePage onSetCodename={handleSetCodename} email={user.email} />;
    }

    const myRank = usersList.findIndex(u => u.id === user.uid) + 1;
    const myFriends = usersList.filter(u => user.friends?.includes(u.id));
    const incomingRequests = usersList.filter(u => user.friendRequests?.includes(u.id));

    // Chat View
    if (currentTab === 'chat' && chatPartner) {
        return (
            <div className="h-screen max-w-lg mx-auto border-x-2 border-black">
                <ChatInterface
                    currentUser={user}
                    chatPartner={chatPartner}
                    onBack={() => { setChatPartner(null); setCurrentTab('friends'); }}
                />
            </div>
        );
    }

    return (
        <div className={`h-screen ${THEME.bg} font-sans flex flex-col w-full max-w-lg mx-auto sm:border-x-2 border-black`}>
            <Marquee />
            <Header user={user} myRank={myRank} />
            <Tabs currentTab={currentTab} setCurrentTab={(tab) => { setCurrentTab(tab); setChatPartner(null); }} />

            <div className="flex-1 overflow-y-auto pb-24 relative">
                <AnimatePresence mode="wait">
                    {currentTab === 'feed' && (
                        <FeedTab feed={feed} users={usersList} />
                    )}
                    {currentTab === 'leaderboard' && (
                        <LeaderboardTab users={usersList} />
                    )}
                    {currentTab === 'friends' && (
                        <FriendsTab
                            myFriends={myFriends}
                            usersList={usersList}
                            currentUserId={user.uid}
                            currentUserFriends={user.friends || []}
                            incomingRequests={incomingRequests}
                            sentRequests={user.sentRequests || []}
                            onSendFriendRequest={handleSendFriendRequest}
                            onAcceptRequest={handleAcceptFriendRequest}
                            onDeclineRequest={handleDeclineFriendRequest}
                            onRemoveFriend={handleRemoveFriend}
                            onOpenChat={(friend) => {
                                setChatPartner(friend);
                                setCurrentTab('chat');
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            <FloatingActionButton onClick={() => setShowAction(true)} />

            <AnimatePresence>
                {showAction && (
                    <AuraAction
                        onClose={() => setShowAction(false)}
                        users={usersList}
                        currentUser={user}
                        onAction={handleTransaction}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
