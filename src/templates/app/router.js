import React from 'react';
import { Route } from 'react-router';

import ValidateRoute from '../../helpers/validateRoute';
import ResendInviteRoute from '../../helpers/resendInviteRoute';
import ResetRoute from '../../helpers/resetRoute';
import NewEmailRoute from '../../helpers/newEmailRoute';
import StripeRoute from '../../helpers/stripeRoute';
import SuperLoginRoute from '../../helpers/superLoginRoute';

import Dashboard from '../pages/Dashboard';
import SchoolPage from '../pages/schools';
import Connects from '../pages/connects';
import Projects from '../pages/projects';
import Setting from '../pages/setting';
import NewProfile from '../pages/NewProfile';
import NewsFeed from '../pages/newsFeed';
import Chats from '../pages/chats';
import ProjectForm from '../pages/ProjectForm';
import ProjectListPage from '../pages/ProjectListPage';
import Project from '../pages/Project';
import Campaigns from '../pages/Campaigns';
import GamePage from '../pages/games';
import GameVocabularyPage from '../pages/games/vocabulary';
import Contact from '../pages/Contact';
import Search from '../pages/search';
import MobilesSearch from '../pages/search/mobile';
import FacebookShare from '../pages/Project/FacebookShare';

import Home from './landing/home';
import NewLearnMore from './landing/NewLearnMore';
import NewAbout from './landing/NewAbout';
import NewNonProfit from './landing/NewNonprofit';

import PageShell from '../common/animatedSwitch';

const router = [
	{
		exact: true,
		path: '/',
		component: Home
	},
	{
		path: '/nonProfit',
		component: NewNonProfit
	},
	{
		exact: true,
		path: '/learn',
		component: NewLearnMore
	},
	{
		exact: true,
		path: '/about',
		component: NewAbout
	},
	{
		exact: true,
		path: '/:id/dashboard',
		component: Dashboard
	},
	{
		exact: false,
		path: '/discovery',
		component: ProjectListPage
	},
	{
		exact: true,
		path: '/search',
		component: Search
	},
	{
		exact: true,
		path: '/m-search',
		component: MobilesSearch
	},
	{
		exact: true,
		path: '/games',
		component: GamePage
	},
	{
		exact: true,
		path: '/games/vocabulary',
		component: GameVocabularyPage
	},
	{
		exact: false,
		path: '/super-login/:id',
		component: SuperLoginRoute
	},
	{
		exact: false,
		path: '/school/:id',
		component: SchoolPage
	},
	{
		exact: false,
		path: '/account-verify/:token',
		component: ValidateRoute
	},
	{
		exact: false,
		path: '/resend-invite/:token',
		component: ResendInviteRoute
	},
	{
		exact: false,
		path: '/stripe-connect',
		component: StripeRoute
	},
	{
		exact: false,
		path: '/change-email/:token',
		component: NewEmailRoute
	},
	{
		exact: false,
		path: '/reset-password/:token',
		component: ResetRoute
	},
	{
		exact: false,
		path: '/:id/project/create',
		component: ProjectForm
	},
	{
		exact: false,
		path: '/:id/project/edit/:projectId',
		component: ProjectForm
	},
	{
		exact: false,
		path: '/:id/project/:projectId',
		component: Project
	},
	{
		exact: true,
		path: '/:id/projects/current-user',
		component: ProjectListPage
	},
	{
		exact: true,
		path: '/:id/projects',
		component: Projects
	},
	{
		exact: true,
		path: '/:id/campaigns/:campaign',
		component: Campaigns
	},
	{
		exact: true,
		path: '/:id',
		component: NewProfile
	},
	{
		exact: false,
		path: '/:id/connects',
		component: Connects
	},
	{
		exact: false,
		path: '/:id/contacts',
		component: Contact
	},
	{
		exact: false,
		path: '/:id/chats',
		component: Chats
	},
	{
		exact: false,
		path: '/:id/news-feed',
		component: NewsFeed
	},
	{
		exact: false,
		path: '/:id/setting',
		component: Setting
	},
	{
		exact: true,
		path: '/facebook-share',
		component: FacebookShare
	},
]

export default function() {
	return router.map((e, i) => {
		return (
			<Route
				key={`${e.path}-${i}`}
				exact={e.exact}
				render={props => (
					<PageShell {...props.match}>
						<e.component {...props} />
					</PageShell>
				)}
				path={e.path}
			/>
		)
	})
}
