import "./addUser.css";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore"

const AddUser = () => {
  const [user, setUser] = useState(null);

  const {currentUser} = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");


    //définit le receiver : user
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };


  //sauvegardes les messages
  const handleAdd = async()=> {

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try{

      //add doc 
      const newChatRef = doc(chatRef)

       //création du chats
      await setDoc(newChatRef,{
          createdAt: serverTimestamp(),
          messages: [],
      })

      //update du userchats du receiver (user)
      await updateDoc( doc(userChatsRef, user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:'',
          receiverId:currentUser.id,
          udatedAt: Date.now()
        })
      })

       //update du userchats du currentuser 
      await updateDoc( doc(userChatsRef, currentUser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:'',
          receiverId:user.id,
          updatedAt: Date.now()
        })
      })

    }catch(err){
      console.log(err)
    }
    
  }
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
