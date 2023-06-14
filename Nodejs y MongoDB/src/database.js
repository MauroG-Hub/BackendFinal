const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MauroGDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,

})
.then(() => { 
    console.log('DB is connected');
})
.catch(err => console.error(err));
