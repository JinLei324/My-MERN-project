import socketIOClient from "socket.io-client";
import {
	checkHintId,
	unreadProjectsCount
} from '../actions/authActions'
import { store } from '../store';

let socket = socketIOClient(process.env.REACT_APP_SOCKET_URL, { path: "/api/v1/socket.io" });

socket.on("connect", () => {
	// console.log(socket.id)
	// console.log(socket)
})

function connectSocket() {
	socket = socketIOClient.connect(process.env.REACT_APP_SOCKET_URL, { path: "/api/v1/socket.io", forceNew: true })
}

function eventTodayTotalStats(cb) {
	socket.on("todayTotalStats", data => {
		cb(data)
	});
}

function listenNotification(cb) {
	socket.on("notification", data => {
		cb(data)
	})
}

function listenFollowRequest(cb) {
	socket.on("followRequest", data => {
		cb(data)
	})
}

function logoutSocket() {
	socket.emit("logout")
}

function listenUserPresenceChanged(cb) {
	socket.on("presenceChanged", data => {
		cb(data)
	})
}

function checkHint(hId) {
	socket.emit("checkHint", hId)
	socket.on("checkHintResponse", data => {
		if (data.status === 1)
			store.dispatch(checkHintId(hId))
	})
}

function unreadProjects() {
	socket.emit("unreadProjects")
	socket.on("unreadProjectsResponse", data => {
		if (data.status === 1)
			store.dispatch(unreadProjectsCount(data.unreadVolunteers, data.unreadDonations, data.unreadPickups))
	})
}

function sendMessage(data) {
	socket.emit("sendMessage", data)
}

function receiveMessage(cb) {
	socket.on("receiveMessage", data => {
		cb(data)
	})
}

export {
	eventTodayTotalStats,
	listenNotification,
	logoutSocket,
	connectSocket,
	listenFollowRequest,
	checkHint,
	sendMessage,
	receiveMessage,
	listenUserPresenceChanged,
	unreadProjects
};