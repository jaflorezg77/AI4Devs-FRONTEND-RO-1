import { updateCandidateStageController } from './candidateController';
import { Request, Response } from 'express';
import { updateCandidateStage } from '../../application/services/candidateService';

jest.mock('../../application/services/candidateService');

describe('updateCandidateStageController', () => {
    it('should return 200 and updated candidate stage', async () => {
      const req = { 
        params: { id: '1' }, 
        body: { applicationId: 1, currentInterviewStep: 'Technical Interview' } 
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      (updateCandidateStage as jest.Mock).mockResolvedValue({
        id: 1,
        applicationId: 1,
        candidateId: 1,
        currentInterviewStep: 2, // El ID de la fase después de la actualización
      });
  
      await updateCandidateStageController(req, res);
  
      expect(updateCandidateStage).toHaveBeenCalledWith(1, 1, 'Technical Interview');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Candidate stage updated successfully',
        data: {
          id: 1,
          applicationId: 1,
          candidateId: 1,
          currentInterviewStep: 2,
        },
      });
    });
  });