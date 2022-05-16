import React from 'react'
import {RiGhostSmileFill, RiGhostSmileLine} from 'react-icons/ri'

function Message({senderId, content, finished}) {
    return <>
        {senderId === "friend" 
            ? (
                <div className="message">
                    <RiGhostSmileLine className='messagePic'/>
                    <div className="messageBody">
                        <p>{finished ? content : "..."}</p>
                    </div>
                </div>
            )
            : (
                <div className="message messageUser">
                    <div className="messageBodyUser">
                        <p>{content}</p>
                    </div>
                    <RiGhostSmileFill className='messagePic'/>
                </div>
            )}
    </>
}

export default Message