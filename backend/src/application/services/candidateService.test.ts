import { updateCandidateStage } from './candidateService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    interviewStep: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('updateCandidateStage', () => {
  it('should update the candidate stage and return the updated application', async () => {
    const mockInterviewStep = {
      id: 2,
      interviewFlowId: 1,
      interviewTypeId: 1,
      name: 'Technical Interview',
      orderIndex: 2,
    };

    const mockApplication = {
      id: 1,
      positionId: 1,
      candidateId: 1,
      currentInterviewStep: 1,
      applicationDate: new Date(),
      notes: null,
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock para encontrar el interview step por nombre
    jest.spyOn(prisma.interviewStep, 'findFirst').mockResolvedValue(mockInterviewStep);
    
    // Mock para la función estática del modelo Application
    const mockFindOneByPositionCandidateId = jest.fn().mockResolvedValue(mockApplication);
    
    // Necesitamos mockear la función estática del modelo Application
    jest.doMock('../../domain/models/Application', () => ({
      Application: {
        findOneByPositionCandidateId: mockFindOneByPositionCandidateId,
      },
    }));

    const result = await updateCandidateStage(1, 1, 'Technical Interview');
    
    expect(mockApplication.currentInterviewStep).toBe(2);
    expect(mockApplication.save).toHaveBeenCalled();
  });
});