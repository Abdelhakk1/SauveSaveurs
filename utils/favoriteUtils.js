import { addToFavorites, removeFromFavorites } from '../Actions/storeActions';

export const toggleFavorite = (item, dispatch, favorites) => {
  if (favorites.some(favorite => favorite.id === item.id)) {
    dispatch(removeFromFavorites(item.id));
  } else {
    dispatch(addToFavorites(item));
  }
};
