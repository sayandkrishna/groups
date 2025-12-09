// import React, { useState, useEffect, useRef } from 'react';
// import { initializeApp } from 'firebase/app';
// import { 
//   getAuth, 
//   signInAnonymously, 
//   onAuthStateChanged,
//   signInWithCustomToken
// } from 'firebase/auth';
// import { 
//   getFirestore, 
//   collection, 
//   addDoc, 
//   onSnapshot, 
//   query, 
//   orderBy, 
//   serverTimestamp, 
//   doc, 
//   setDoc, 
//   increment, 
//   updateDoc, 
//   limit,
//   arrayUnion,
//   arrayRemove
// } from 'firebase/firestore';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Crown, Flame, Skull, Zap, TrendingUp, TrendingDown, Plus, Menu, X, Share2, History, Users, UserPlus, UserMinus, Search } from 'lucide-react';

// // --- FIREBASE SETUP ---
// const firebaseConfig = JSON.parse(__firebase_config);
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// // --- COLORS & THEME ---
// // Neo-brutalist palette
// const THEME = {
//   bg: 'bg-[#f0f0f0]',
//   surface: 'bg-white',
//   primary: 'bg-[#FF4D00]', // International Orange
//   secondary: 'bg-[#00F0FF]', // Cyan
//   accent: 'bg-[#CCFF00]', // Lime
//   dark: 'bg-[#1a1a1a]',
//   border: 'border-black border-2',
//   shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
//   shadowActive: 'active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]',
// };

// // --- UTILS ---
// const generateAvatar = (name) => {
//   const seeds = ['😺', '👽', '💀', '🤖', '👾', '🤡', '👹', '👺', '👻'];
//   return seeds[name.length % seeds.length];
// };

// const formatAura = (num) => {
//   return num > 0 ? `+${num}` : `${num}`;
// };

// // --- COMPONENTS ---

// // 1. The Marquee Header
// const Marquee = () => (
//   <div className="bg-black text-white overflow-hidden py-2 border-b-2 border-black sticky top-0 z-50">
//     <motion.div 
//       className="whitespace-nowrap font-mono font-bold text-sm flex gap-8"
//       animate={{ x: [0, -1000] }}
//       transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
//     >
//       {[...Array(10)].map((_, i) => (
//         <span key={i} className="flex items-center gap-2">
//           <Zap size={14} className="text-yellow-400" /> 
//           WHO IS COOKED? // AURA CHECK // PROTECT YOUR ENERGY // 
//           <Skull size={14} className="text-red-500" />
//         </span>
//       ))}
//     </motion.div>
//   </div>
// );

// // 2. Button Component
// const BrutalButton = ({ children, onClick, color = 'bg-white', className = '', type="button", disabled=false }) => (
//   <button
//     type={type}
//     disabled={disabled}
//     onClick={onClick}
//     className={`
//       ${THEME.border} ${THEME.shadow} ${THEME.shadowActive}
//       ${color} font-black uppercase px-6 py-3 transition-all
//       disabled:opacity-50 disabled:cursor-not-allowed
//       flex items-center justify-center gap-2
//       ${className}
//     `}
//   >
//     {children}
//   </button>
// );

// // 3. User Login / Onboarding
// const Onboarding = ({ onJoin }) => {
//   const [handle, setHandle] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (handle.trim().length > 2) onJoin(handle);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#CCFF00] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
//       <motion.div 
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className={`bg-white p-8 max-w-sm w-full ${THEME.border} ${THEME.shadow} text-center`}
//       >
//         <h1 className="text-4xl font-black mb-2 italic">AURA<br/>TRACKER</h1>
//         <p className="font-mono text-sm mb-6 border-b-2 border-black pb-4">
//           Quantify the vibe. Score your friends.
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="text-left">
//             <label className="font-bold text-xs uppercase ml-1">Codename</label>
//             <input 
//               type="text" 
//               placeholder="@chillguy"
//               value={handle}
//               onChange={(e) => setHandle(e.target.value)}
//               className={`w-full p-4 font-bold outline-none ${THEME.border} focus:bg-pink-100 transition-colors`}
//               maxLength={12}
//             />
//           </div>
//           <BrutalButton type="submit" color={THEME.primary} className="text-white w-full">
//             Enter The Arena
//           </BrutalButton>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// // 4. Action Modal (Give/Take Aura)
// const AuraAction = ({ onClose, users, currentUser, onAction }) => {
//   const [selectedUser, setSelectedUser] = useState('');
//   const [amount, setAmount] = useState(100);
//   const [reason, setReason] = useState('');
//   const [type, setType] = useState('glaze'); // glaze (+) or roast (-)

//   // Sort users: Friends first, then everyone else
//   const friendIds = currentUser?.friends || [];
//   const sortedUsers = [...users].sort((a, b) => {
//     const aIsFriend = friendIds.includes(a.id);
//     const bIsFriend = friendIds.includes(b.id);
//     if (aIsFriend && !bIsFriend) return -1;
//     if (!aIsFriend && bIsFriend) return 1;
//     return 0; // Keep existing sort order (aura)
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUser || !reason) return;
    
//     const finalAmount = type === 'glaze' ? Math.abs(amount) : -Math.abs(amount);
//     await onAction(selectedUser, finalAmount, reason);
//     onClose();
//   };

//   return (
//     <motion.div 
//       initial={{ y: "100%" }}
//       animate={{ y: 0 }}
//       exit={{ y: "100%" }}
//       className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4"
//     >
//       <div className={`w-full max-w-md bg-white ${THEME.border} ${THEME.shadow} overflow-hidden flex flex-col max-h-[90vh]`}>
//         <div className="bg-black text-white p-4 flex justify-between items-center">
//           <h2 className="font-black text-xl uppercase blink">Vibe Check</h2>
//           <button onClick={onClose}><X className="text-white" /></button>
//         </div>

//         <div className="p-6 overflow-y-auto space-y-6">
//           {/* Toggle Type */}
//           <div className="flex gap-2">
//             <button 
//               onClick={() => setType('glaze')}
//               className={`flex-1 py-3 font-black uppercase border-2 border-black transition-all ${type === 'glaze' ? 'bg-[#00F0FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 opacity-50'}`}
//             >
//               Glaze (+)
//             </button>
//             <button 
//               onClick={() => setType('roast')}
//               className={`flex-1 py-3 font-black uppercase border-2 border-black transition-all ${type === 'roast' ? 'bg-[#FF4D00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 opacity-50'}`}
//             >
//               Roast (-)
//             </button>
//           </div>

//           {/* User Select */}
//           <div>
//             <label className="font-bold text-xs uppercase block mb-1">Target</label>
//             <select 
//               className={`w-full p-3 font-bold bg-white ${THEME.border}`}
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//             >
//               <option value="">Select a victim...</option>
//               {sortedUsers.filter(u => u.id !== currentUser?.uid).map(u => (
//                 <option key={u.id} value={u.id}>
//                   {friendIds.includes(u.id) ? '★ ' : ''}{u.handle} ({u.aura})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Amount Slider */}
//           <div>
//             <label className="font-bold text-xs uppercase block mb-1">Magnitude: {amount}</label>
//             <input 
//               type="range" 
//               min="10" 
//               max="10000" 
//               step="10" 
//               value={amount} 
//               onChange={(e) => setAmount(parseInt(e.target.value))}
//               className="w-full accent-black h-4 bg-gray-200 rounded-none appearance-none border-2 border-black"
//             />
//             <div className="flex justify-between text-xs font-mono mt-1 opacity-60">
//               <span>Mild</span>
//               <span>Celestial</span>
//             </div>
//           </div>

//           {/* Reason */}
//           <div>
//             <label className="font-bold text-xs uppercase block mb-1">The Receipt (Reason)</label>
//             <textarea 
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder={type === 'glaze' ? "Held the door open..." : "Tripped on nothing..."}
//               className={`w-full p-3 font-bold bg-gray-50 ${THEME.border} h-24 resize-none`}
//             />
//           </div>

//           <BrutalButton onClick={handleSubmit} color="bg-yellow-400" className="w-full">
//             Confirm Transaction
//           </BrutalButton>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // 5. Transaction Feed Item
// const FeedItem = ({ item, users }) => {
//   const sender = users.find(u => u.id === item.senderId)?.handle || 'Unknown';
//   const receiver = users.find(u => u.id === item.receiverId)?.handle || 'Unknown';
//   const isPositive = item.amount > 0;

//   return (
//     <motion.div 
//       layout
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className={`p-4 mb-3 bg-white ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-3`}
//     >
//       <div className={`shrink-0 w-10 h-10 ${THEME.border} flex items-center justify-center ${isPositive ? 'bg-cyan-300' : 'bg-red-400'}`}>
//         {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-start">
//           <p className="font-bold text-sm truncate">
//             {receiver} <span className="text-gray-500 font-normal text-xs">was {isPositive ? 'glazed' : 'roasted'} by</span> {sender}
//           </p>
//           <span className={`font-black text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//             {item.amount > 0 ? '+' : ''}{item.amount}
//           </span>
//         </div>
//         <p className="text-xs font-mono text-gray-600 mt-1 break-words">"{item.reason}"</p>
//       </div>
//     </motion.div>
//   );
// };

// // 6. Main App Container
// const App = () => {
//   const [user, setUser] = useState(null);
//   const [usersList, setUsersList] = useState([]);
//   const [feed, setFeed] = useState([]);
//   const [showAction, setShowAction] = useState(false);
//   const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'leaderboard' | 'friends'
//   const [loading, setLoading] = useState(true);
//   const [friendInput, setFriendInput] = useState('');
//   const [feedback, setFeedback] = useState({ type: '', msg: '' });

//   // --- AUTH & DATA SYNC ---
//   useEffect(() => {
//     const init = async () => {
//       // 1. Auth
//       if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
//         await signInWithCustomToken(auth, __initial_auth_token);
//       } else {
//         await signInAnonymously(auth);
//       }
//     };
//     init();

//     const unsubAuth = onAuthStateChanged(auth, async (u) => {
//       if (u) {
//         // Check if profile exists
//         const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users_v2', u.uid);
//         onSnapshot(userDocRef, (docSnap) => {
//            if (docSnap.exists()) {
//              setUser({ ...docSnap.data(), uid: u.uid });
//            } else {
//              setUser({ uid: u.uid, isNew: true });
//            }
//         });
//       }
//       setLoading(false);
//     });

//     return () => unsubAuth();
//   }, []);

//   // Fetch Users & Feed
//   useEffect(() => {
//     if (!user) return;
    
//     // Users Listener
//     const usersQ = query(collection(db, 'artifacts', appId, 'public', 'data', 'users_v2'));
//     const unsubUsers = onSnapshot(usersQ, (snap) => {
//       const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//       setUsersList(list.sort((a,b) => b.aura - a.aura));
//     }, (err) => console.log(err));

//     // Feed Listener
//     const feedQ = query(
//       collection(db, 'artifacts', appId, 'public', 'data', 'transactions_v2'),
//       orderBy('createdAt', 'desc'),
//       limit(50)
//     );
//     const unsubFeed = onSnapshot(feedQ, (snap) => {
//       setFeed(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     }, (err) => console.log(err));

//     return () => { unsubUsers(); unsubFeed(); };
//   }, [user]);

//   // --- HANDLERS ---
//   const handleJoin = async (handle) => {
//     if (!auth.currentUser) return;
//     const uid = auth.currentUser.uid;
//     const userData = {
//       handle,
//       aura: 0,
//       avatar: generateAvatar(handle),
//       friends: [], // Initialize friends array
//       joinedAt: serverTimestamp()
//     };
    
//     await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users_v2', uid), userData);
//   };

//   const handleTransaction = async (targetId, amount, reason) => {
//     if (!user || !user.handle) return;
    
//     // 1. Log Transaction
//     await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions_v2'), {
//       senderId: user.uid,
//       receiverId: targetId,
//       amount,
//       reason,
//       createdAt: serverTimestamp()
//     });

//     // 2. Update Target Aura
//     await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users_v2', targetId), {
//       aura: increment(amount)
//     });
//   };

//   const handleAddFriend = async (e) => {
//     e.preventDefault();
//     setFeedback({ type: '', msg: '' });
    
//     if (!friendInput.trim()) return;
//     if (friendInput.trim() === user.handle) {
//        setFeedback({ type: 'error', msg: "You can't add yourself, narcissist." });
//        return;
//     }

//     const targetUser = usersList.find(u => u.handle.toLowerCase() === friendInput.trim().toLowerCase());
    
//     if (!targetUser) {
//       setFeedback({ type: 'error', msg: 'User not found. Are they invisible?' });
//       return;
//     }

//     if (user.friends?.includes(targetUser.id)) {
//       setFeedback({ type: 'error', msg: 'Already in your crew.' });
//       return;
//     }

//     try {
//       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users_v2', user.uid), {
//         friends: arrayUnion(targetUser.id)
//       });
//       setFriendInput('');
//       setFeedback({ type: 'success', msg: `Added ${targetUser.handle} to the crew.` });
//     } catch (err) {
//       setFeedback({ type: 'error', msg: 'Glitch in the matrix. Try again.' });
//     }
//   };

//   const handleRemoveFriend = async (friendId) => {
//     try {
//       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users_v2', user.uid), {
//         friends: arrayRemove(friendId)
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-mono">LOADING_ASSETS...</div>;
//   if (!user || user.isNew) return <Onboarding onJoin={handleJoin} />;

//   // Rank logic
//   const myRank = usersList.findIndex(u => u.id === user.uid) + 1;
  
//   // Friends Logic
//   const myFriends = usersList.filter(u => user.friends?.includes(u.id));

//   return (
//     <div className={`min-h-screen ${THEME.bg} font-sans flex flex-col max-w-lg mx-auto border-x-2 border-black`}>
//       <Marquee />

//       {/* HEADER CARD */}
//       <header className="p-4 pt-6">
//         <div className={`bg-white ${THEME.border} ${THEME.shadow} p-4 relative overflow-hidden`}>
//           <div className="absolute top-0 right-0 p-2 opacity-10">
//             <Crown size={100} />
//           </div>
//           <div className="flex justify-between items-center relative z-10">
//             <div>
//               <p className="font-mono text-xs text-gray-500 uppercase">Current Status</p>
//               <h1 className="text-4xl font-black mt-1 leading-none tracking-tighter">
//                 {user.aura} <span className="text-lg">PTS</span>
//               </h1>
//             </div>
//             <div className="text-right">
//               <div className="text-4xl">{user.avatar}</div>
//               <p className="font-bold text-sm mt-1">{user.handle}</p>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t-2 border-black flex gap-4 text-xs font-bold uppercase">
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               Rank: #{myRank}
//             </div>
//             <div className="flex items-center gap-1 text-gray-500">
//               ID: {user.uid.slice(0, 4)}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* TABS */}
//       <div className="px-4 flex gap-2">
//         <button 
//           onClick={() => setCurrentTab('feed')}
//           className={`flex-1 py-2 font-bold text-sm uppercase border-2 border-black transition-all ${currentTab === 'feed' ? 'bg-black text-white' : 'bg-white text-black'}`}
//         >
//           Feed
//         </button>
//         <button 
//           onClick={() => setCurrentTab('leaderboard')}
//           className={`flex-1 py-2 font-bold text-sm uppercase border-2 border-black transition-all ${currentTab === 'leaderboard' ? 'bg-black text-white' : 'bg-white text-black'}`}
//         >
//           Ranking
//         </button>
//         <button 
//           onClick={() => setCurrentTab('friends')}
//           className={`flex-1 py-2 font-bold text-sm uppercase border-2 border-black transition-all ${currentTab === 'friends' ? 'bg-black text-white' : 'bg-white text-black'}`}
//         >
//           Day Ones
//         </button>
//       </div>

//       {/* CONTENT AREA */}
//       <div className="flex-1 p-4 pb-24 overflow-y-auto">
//         <AnimatePresence mode="wait">
//           {currentTab === 'feed' && (
//             <motion.div 
//               key="feed"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//             >
//               <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
//                 <History size={20}/> Live Log
//               </h3>
//               {feed.length === 0 ? (
//                 <div className="text-center py-10 opacity-50 font-mono">No aura detected yet.</div>
//               ) : (
//                 feed.map(item => <FeedItem key={item.id} item={item} users={usersList} />)
//               )}
//             </motion.div>
//           )}

//           {currentTab === 'leaderboard' && (
//             <motion.div 
//               key="leaderboard"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="space-y-3"
//             >
//               <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
//                 <Crown size={20}/> Top Gs
//               </h3>
//               {usersList.map((u, idx) => (
//                 <div key={u.id} className={`flex items-center p-3 bg-white ${THEME.border} ${idx < 3 ? 'shadow-[4px_4px_0px_0px_#FFD700]' : ''}`}>
//                   <span className={`font-black text-lg w-8 ${idx === 0 ? 'text-[#FFD700]' : ''}`}>#{idx + 1}</span>
//                   <span className="text-2xl mr-3">{u.avatar}</span>
//                   <div className="flex-1">
//                     <p className="font-bold leading-none">{u.handle}</p>
//                     <p className="text-xs font-mono text-gray-500">
//                       {u.aura > 5000 ? 'CELESTIAL' : u.aura > 1000 ? 'MAIN CHARACTER' : u.aura < 0 ? 'COOKED' : 'NPC'}
//                     </p>
//                   </div>
//                   <span className="font-black">{u.aura}</span>
//                 </div>
//               ))}
//             </motion.div>
//           )}

//           {currentTab === 'friends' && (
//              <motion.div 
//              key="friends"
//              initial={{ opacity: 0, y: 10 }}
//              animate={{ opacity: 1, y: 0 }}
//              exit={{ opacity: 0, y: -10 }}
//              className="space-y-6"
//            >
//              {/* ADD FRIEND SECTION */}
//              <div className={`bg-[#CCFF00] p-4 ${THEME.border} ${THEME.shadow}`}>
//                 <h3 className="font-black text-sm uppercase mb-2 flex items-center gap-2">
//                   <UserPlus size={16}/> Recruit Homie
//                 </h3>
//                 <form onSubmit={handleAddFriend} className="flex gap-2">
//                   <div className="relative flex-1">
//                     <input 
//                       type="text" 
//                       placeholder="Enter handle (e.g. @sigma)"
//                       value={friendInput}
//                       onChange={(e) => setFriendInput(e.target.value)}
//                       className={`w-full p-2 pl-8 font-bold text-sm bg-white ${THEME.border} focus:outline-none`}
//                     />
//                     <Search size={14} className="absolute left-2 top-3 opacity-50"/>
//                   </div>
//                   <BrutalButton type="submit" className="px-4 py-2 text-xs">
//                     Add
//                   </BrutalButton>
//                 </form>
//                 {feedback.msg && (
//                   <p className={`mt-2 text-xs font-mono font-bold ${feedback.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
//                     {feedback.msg}
//                   </p>
//                 )}
//              </div>

//              {/* FRIENDS LIST */}
//              <div>
//                <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
//                  <Users size={20}/> The Crew ({myFriends.length})
//                </h3>
               
//                {myFriends.length === 0 ? (
//                  <div className="p-8 text-center border-2 border-dashed border-gray-400 opacity-50">
//                    <p className="font-mono text-sm">No day ones found.</p>
//                    <p className="font-mono text-xs mt-1">Add someone to check their aura faster.</p>
//                  </div>
//                ) : (
//                  <div className="space-y-3">
//                    {myFriends.map((u) => (
//                      <div key={u.id} className={`flex items-center p-3 bg-white ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
//                        <span className="text-2xl mr-3">{u.avatar}</span>
//                        <div className="flex-1">
//                          <p className="font-bold leading-none">{u.handle}</p>
//                          <p className="text-xs font-mono text-gray-500">Aura: {u.aura}</p>
//                        </div>
//                        <button 
//                         onClick={() => handleRemoveFriend(u.id)}
//                         className="p-2 hover:bg-red-100 transition-colors"
//                         title="Remove Friend"
//                        >
//                          <UserMinus size={16} className="text-red-500" />
//                        </button>
//                      </div>
//                    ))}
//                  </div>
//                )}
//              </div>
//            </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* FAB (Floating Action Button) */}
//       <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setShowAction(true)}
//           className="pointer-events-auto bg-[#CCFF00] text-black border-2 border-black w-16 h-16 flex items-center justify-center rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
//         >
//           <Plus size={32} strokeWidth={3} />
//         </motion.button>
//       </div>

//       <AnimatePresence>
//         {showAction && (
//           <AuraAction 
//             onClose={() => setShowAction(false)} 
//             users={usersList} 
//             currentUser={user}
//             onAction={handleTransaction}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default App;