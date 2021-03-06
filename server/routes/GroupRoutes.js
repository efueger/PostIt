import express from 'express';
import GroupController from '../controllers/GroupController';

const router = express.Router();
router.post('/api/group', GroupController.createGroup());
router.route('/api/group/:groupId/user')
.post(GroupController.permitOnlyGroupMembers(),
 GroupController.addUserToGroup())
.delete(GroupController.permitOnlyGroupOwner(),
GroupController.removeUserFromGroup());
router.post('/api/group/:groupId/message',
 GroupController.permitOnlyGroupMembers(),
 GroupController.addMessageToGroup());
router.get('/api/group/:groupId/messages',
 GroupController.permitOnlyGroupMembers(),
 GroupController.getGroupMessages());

export default router;
