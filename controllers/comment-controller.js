const { Comment, Pizza } = require('../models');

const commentController = {
    // create comment
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'no pizza with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    //add reply to comment
    addReply({ params, body }, res){
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body }},
            {new: true, runValidators: true } 
        )
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'no comment fount with this id'});
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err));
    },
    // delete comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id'});
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'no pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            res.status(400).json(err);
        })
    },
    //remove a reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: {replies: { replyID: params.replyId} } },
            { new: true}
            )
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No comment with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            res.status(400).json(err);
        })
    } 
};

module.exports = commentController;