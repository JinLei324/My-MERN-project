import { all } from 'redux-saga/effects'
import { project } from './project'
import { game } from './game'
import { auth } from './auth'
import { follows } from './follows'
import { notification } from './notification'
import { setting } from './setting'
import { globalInfo } from './global'
import { user } from './user'
import { post } from './post'
import { contact } from './contact'
import { search } from './search'
import { gift } from './gift'
import { chat } from './chat'
import { give } from './give'
import { donate } from './donate'

export default function* rootSage() {
	yield all([
		project(),
		game(),
		auth(),
		follows(),
		notification(),
		setting(),
		globalInfo(),
		user(),
		post(),
		contact(),
		search(),
		gift(),
		chat(),
		give(),
		donate()
	])
}
