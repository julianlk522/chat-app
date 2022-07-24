import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { assignNewPreferedPic } from '../context/ChatActions';
import { fetchPreferedPic } from './utils/fetchPreferedPic';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import genericPic from '../assets/genericPic.jpg';

function UserInfo() {
  const { state, dispatch } = useContext(ChatContext);

  //  local state
  const [editPreferedPic, setEditPreferedPic] = useState(false);
  const [preferedPicSelected, setPreferedPicSelected] = useState(null);

  const navigate = useNavigate();

  return (
    <div
      id="userProfileArea"
      className="py-4 flex flex-col justify-evenly items-center w-full h-[20%] border-t-2 border-t-slate-300"
    >
      {!editPreferedPic ? (
        <div
          id="nameAndPicDiv"
          className="flex justify-evenly items-center mb-4"
        >
          <img
            src={fetchPreferedPic(state.user.prefered_pic)}
            alt="profile pic"
            className="rounded-full w-16 h-16 object-cover border-2 border-slate-300 border-opacity-50 hover:opacity-50 cursor-pointer"
            onClick={() => setEditPreferedPic(!editPreferedPic)}
          />

          <p id="userName" className="text-xl text-center font-bold ml-8">
            {state.user.name}
          </p>
        </div>
      ) : (
        <div
          id="profilePicSelectionDiv"
          className="flex justify-evenly items-center w-full"
        >
          <img
            src={trexPic}
            alt="pic1"
            className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
              preferedPicSelected === 1 && 'opacity-100'
            }`}
            onClick={() => {
              if (preferedPicSelected !== 1) setPreferedPicSelected(1);
              else setPreferedPicSelected(null);
            }}
          />

          <img
            src={gorfPic}
            alt="pic2"
            className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
              preferedPicSelected === 2 && 'opacity-100'
            }`}
            onClick={() => {
              if (preferedPicSelected !== 2) setPreferedPicSelected(2);
              else setPreferedPicSelected(null);
            }}
          />
          <img
            src={crazyGuyPic}
            alt="pic3"
            className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
              preferedPicSelected === 3 && 'opacity-100'
            }`}
            onClick={() => {
              if (preferedPicSelected !== 3) setPreferedPicSelected(3);
              else setPreferedPicSelected(null);
            }}
          />
          <img
            src={genericPic}
            alt="pic4"
            className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
              preferedPicSelected === 4 && 'opacity-100'
            }`}
            onClick={() => {
              if (preferedPicSelected !== 4) setPreferedPicSelected(4);
              else setPreferedPicSelected(null);
            }}
          />
        </div>
      )}
      {!editPreferedPic ? (
        <button
          className="focus:outline-none rounded-2xl bg-red-600 hover:bg-red-700 p-2 w-1/3 text-white"
          onClick={e => {
            e.preventDefault();
            dispatch({ type: 'LOGOUT_USER' });
            localStorage.removeItem('chatUser');
            window.google?.accounts?.id?.disableAutoSelect();
            navigate('/auth');
          }}
        >
          Logout
        </button>
      ) : (
        <button
          className={`rounded-2xl p-2 text-white ${
            !editPreferedPic && 'w-1/3'
          } ${
            editPreferedPic &&
            preferedPicSelected !== null &&
            preferedPicSelected !== state.user.prefered_pic
              ? 'bg-lime-500'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          onClick={() => {
            if (
              editPreferedPic &&
              preferedPicSelected &&
              preferedPicSelected !== state.user.prefered_pic
            ) {
              assignNewPreferedPic(state.user.user_id, preferedPicSelected);
              dispatch({
                type: 'SET_NEW_PREFERED_PIC',
                payload: preferedPicSelected,
              });
            }
            setEditPreferedPic(!editPreferedPic);
            setPreferedPicSelected(null);
          }}
        >
          {preferedPicSelected &&
          preferedPicSelected !== state.user.prefered_pic
            ? 'Confirm new avatar selection'
            : 'Actually I like this avatar'}
        </button>
      )}
    </div>
  );
}

export default UserInfo;
