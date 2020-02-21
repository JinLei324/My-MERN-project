import { combineReducers } from 'redux';
import notifications from './notificationReducer';
import authentication from './authReducer';
import follows from './followsReducer';
import preloader from './preloader';
import globalReducer from './globalReducer';
import project from './project';
import game from './game';
import user from './user';
import post from './post';
import contact from './contact';
import search from './search';
import chat from './chat';
import give from './give';
import donate from './donate';

export default combineReducers({
	notifications,
	authentication,
	follows,
	project,
	game,
	preloader,
	globalReducer,
	user,
	post,
	contact,
	search,
	chat,
	give,
	donate
});