const express = require("express");
const router = express.Router();
const Notification = require('../models/notification.model')

router.get('/', async (req, res) => {
    const notificationList = await Notification.find();
    if (!notificationList) {
        res.status(400).json({ success: false })
    }
    res.status(200).send(notificationList)
})

router.get('/totalCount', async (req, res) => {
    const count = await Notification.countDocuments({});
    console.log(`count: ${count}`)

    if (count == 0) {
        res.status(200).send({ 'message': 'No Blogs Found' });
        return;
    }

    if (!count) {
        res.status(400).json({ success: false })
    }
    res.status(200).send({ 'count': count });
})

router.delete('/:id', (req, res) => {
    Notification.findByIdAndRemove(req.params.id).then(notification => {
      if (notification) {
        return res.status(200).json({ success: true, message: 'the notification is deleted' })
      } else {
        return res.status(400).json({ success: false, message: 'notification cannot be found' })
      }
  
    }).catch(err => {
      return res.status(400), json({ success: false, error: err })
    })
  });

module.exports = router