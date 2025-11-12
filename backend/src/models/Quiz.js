import mongoose, {Schema} from 'mongoose';

const QuestionSchema = new Schema({
    type: {type: String, enum: ['mcq', 'truefalse', 'text'], required: true},
    question: {type: String, required: true},
    options: {type: [String], default: []},
    correctAnswer: Schema.Types.Mixed,
    points:{type: Number, default: 1},
});

const QuizSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, default: ''},
    questions: {type: [QuestionSchema], default: []},
}, {timestamps: true});

export const Quiz = mongoose.model('Quiz', QuizSchema);