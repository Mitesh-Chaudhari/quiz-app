import { Router } from 'express';
import { Quiz } from '../models/Quiz.js';
const router = Router();

//GET /api/quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST /api/quizzes
router.post('/', async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//GET /api/quizzes/:id
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//PUT /api/quizzes/:id
router.put('/:id', async (req, res) => {
    try {
        const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE /api/quizzes/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Quiz.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST /api/quizzes/:id/submit
router.post('/:id/submit', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const {answers} = req.body;
        const results = [];
        let totalPoints = 0;
        let scored = 0;

        for(let q of quiz.questions) {
            totalPoints += q.points || 1;
            const ansObj = (answers || []).find(a => String(a.questionId) === String(q._id));
            let correct = false;
            if(!ansObj) {
                correct = false;
            }else{
                const given = ansObj.answer;
                if (q.type === 'mcq') {
                    correct = Number(given) === Number(q.correctAnswer);
                } else if (q.type === 'truefalse') {
                    correct = (given === true || given === 'true' || given === 'True') === Boolean(q.correctAnswer);
                } else if (q.type === 'text') {
                    if(!q.correctAnswer || q.correctAnswer.length === 0) {
                        correct = false;
                    }else{
                        correct = String(given).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                    }
                }
            }
            if(correct){
                scored += (q.points || 1);
            }
            results.push({
                questionId: q._id,
                correct
            });
        }
        res.json({score: scored, total: totalPoints, results});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;