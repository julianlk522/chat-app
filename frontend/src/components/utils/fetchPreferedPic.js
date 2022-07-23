import genericPic from '../../assets/genericPic.jpg';
import crazyGuyPic from '../../assets/crazyGuyPic.jpg';
import trexPic from '../../assets/trexPic.jpg';
import gorfPic from '../../assets/gorfPic.jpg';

export const fetchPreferedPic = preferedPicId => {
  let preferedPic;
  switch (preferedPicId) {
    case 1:
      preferedPic = trexPic;
      break;
    case 2:
      preferedPic = gorfPic;
      break;
    case 3:
      preferedPic = crazyGuyPic;
      break;
    default:
      preferedPic = genericPic;
  }
  return preferedPic;
};
