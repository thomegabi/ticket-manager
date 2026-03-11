import express from 'express';
import { check } from 'express-validator';
import * as casesController from '../controllers/cases-controller';
import { verifyToken } from '../middlewares/token-auth-middleware';

const router = express.Router();


router.get('/cases', casesController.getCases);

router.get('/case/:caseId', casesController.getCasesById)

router.get('/cases/report', verifyToken, casesController.getDurationReport)

router.post('/cases/create', casesController.createCase);

router.put('/update/:caseId', verifyToken, casesController.updateCase)

router.delete('/case/:caseId/delete', verifyToken, casesController.deleteCase)

export default router;
