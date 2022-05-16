import React, {useState, useContext} from 'react'
import ChatContext from '../context/ChatContext'
import {RiGhostSmileLine} from 'react-icons/ri'


function ContactInfo() {

  const {handleSliderToggle} = useContext(ChatContext)

  const [hideAlertsToggle, setHideAlertsToggle] = useState(true)

  const tempSliderToggle = () => {
    setHideAlertsToggle(!hideAlertsToggle)
  }
  
  return (
    <div id='contactInfo'>
      <div id="contactInfoPicArea">
        <RiGhostSmileLine id='contactInfoPic'/>
        <h3>Sneha</h3>
        <p>The one and only</p>
      </div>

      <div id="settingsDiv">
        <div id="hideAlerts">
          <p>Hide Alerts</p>
          <div 
            className={hideAlertsToggle ? "sliderDiv" : "sliderDivOff"}
            onClick={tempSliderToggle}
          >
            <div className="ball"></div>
          </div>
        </div>
        <hr />
        <div id="sendReadReceipts">
        <p>Send Read Receipts</p>
          <div className="sliderDiv">
            <div className="ball"></div>
          </div>
        </div>
      </div>

      <div id="contactTimeline">
        <h4>Timeline of Sneha</h4>

        <div id="photosDiv">
          <p>Photos and Videos</p>
          <hr />
          <div id="photos">
            <RiGhostSmileLine />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo