const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-notes'); 
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description } = req.body;
    console.log(req);
    const errors = [];
    if(!title){
        errors.push({text: 'Please Write a Title'});
    }
    if(!description){
        errors.push({text: 'Please Write a Description'});
    }
    if(errors.length > 0){
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    }
    else{
        const newNote = new Note({title, description});
        newNote.user = req.user._id;
        console.log(req.user._id);
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user._id}).lean().sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description}).lean();
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;

