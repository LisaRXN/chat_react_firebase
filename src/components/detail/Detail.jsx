import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
  const { currentUser } = useUserStore();


  const handleBlock = async () => {

    if(!user) return ;

    const userDocRef = doc(db, "users", currentUser.id)

    try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock()
    }catch(err){
      console.log(err)
    }
  
}

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum...</p>
      </div>

      <div className="info">

        <div className="options">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="options">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="options">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItems">
              <div className="photoDetail">
                <img
                  src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                  alt=""
                />
                <span>photo_2024.png</span>
              </div>

              <img src="./download.png" alt="" className="icon" />
            </div>
            {/* <div className="photoItems">
              <div className="photoDetail">
                <img
                  src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                  alt=""
                />
                <span>photo_2024.png</span>
              </div>

              <img src="./download.png" alt="" className="icon" />
            </div> */}
            {/* <div className="photoItems">
              <div className="photoDetail">
                <img
                  src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                  alt=""
                />
                <span>photo_2024.png</span>
              </div>

              <img src="./download.png" alt="" className="icon" />
            </div> */}
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User blocked" : "Block user"
          }</button>
        <button className="logout" onClick={()=>{auth.signOut()}}>Logout</button>

      </div>
    </div>
  );
};

export default Detail;
