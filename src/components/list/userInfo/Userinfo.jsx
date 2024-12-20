import './Userinfo.css'
import {useUserStore} from "../../../lib/userStore"

const Userinfo =()=>{

    const {currentUser, isLoading, fetchUserInfo} = useUserStore()

    return(
        <div className="userInfo">
            <div className='user'>
                <img src={currentUser.avatar || "./avatar.png"} alt=""/>
                <h3 className=''>{currentUser.username}</h3>
            </div>
            <div className='icons'>
                <img src="./more.png" alt=""></img>
                <img src="./video.png" alt=""></img>
                <img src="./edit.png" alt=""></img>
            </div>
        </div>
    )
}

export default Userinfo