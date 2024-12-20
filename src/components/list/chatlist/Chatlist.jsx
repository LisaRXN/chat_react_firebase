import { useEffect, useState } from "react";
import "./chatlist.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Chatlist = () => {

  const [chats, setChats] = useState([]);
  const [addMode, setAddmode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();

  const {chatId, changeChat } = useChatStore();

  // useEffect(() => {
  //   const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {

  //     async (res)=> {
  //       const items = res.data().chats;

  //       const promises = items.map( async (item)=> {           //pour chaque conversation
  //         const userDocRef = doc(db, "users", item.receiverId ) //chercher dans la db l'autre user
  //         const userDocSnap = await getDoc(userDocRef)          //fetch les données

  //         const user = userDocSnap.data();                      //stock les données dans une constante
          
  //         return {...item, user};

  //       })

  //       const chatData = await Promise.all(promises)

  //       setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
  //     }
  //   });

  //   return () => {
  //     unSub();
  //   };
  // }, [currentUser.id]);

  useEffect(() => {

    const fetchChats = async (chatsData) => {
      const promises = chatsData.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const resolvedChats = await Promise.all(promises);
      setChats(resolvedChats.sort((a, b) => b.updatedAt - a.updatedAt)); // Trie les conversations par date
    };

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), (snapshot) => {
      const chatsData = snapshot.data()?.chats || [];
      fetchChats(chatsData);
    });

    return () => unSub();
  }, [currentUser?.id]);



  const handleSelect = async (chat) => {

    const userChats = chats.map( item => {
      const {user, ...rest} = item;
      return rest;
    })

    const chatIndex = userChats.findIndex( (item)=> item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true

    const userChatsRef = doc(db, "userchats", currentUser.id)

    try{

      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user)

    }catch(err){
      console.log(err)
    }
  }

  const filteredChats = chats.filter( c=> c.user.username.toLowerCase().includes(input.toLowerCase()))



  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png"></img>
          <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}></input>
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => {
            setAddmode((prev) => !prev);
          }}
        />
      </div>
      {filteredChats.map((chat) => (
          <div 
          className="item"
          key={chat.chatId} 
          onClick={()=>handleSelect(chat)} 
          style={{backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"}}>
            <img src={ chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"}></img>
            <div className="texts">
              <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>

      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default Chatlist;
