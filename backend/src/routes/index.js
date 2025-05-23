import { Router } from 'express';
import todoRoutes from './todoRoutes.js';
import summaryRoutes from './summaryRoutes.js';

const apiRouter = Router();

apiRouter.use('/todos', todoRoutes);
apiRouter.use('/summarize', summaryRoutes);


export default apiRouter;
