import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesByPositionService = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: { positionId },
        include: {
            candidate: true,
            interviews: true,
            interviewStep: true
        }
    });

    return applications.map(app => ({
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        currentInterviewStep: app.interviewStep.name,
        averageScore: app.interviews.length > 0 
            ? Math.round(app.interviews.reduce((acc, int) => acc + (int.score || 0), 0) / app.interviews.length)
            : 0,
        id: app.candidate.id,
        applicationId: app.id
    }));
};

export const getInterviewFlowByPositionService = async (positionId: number) => {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
            interviewFlow: {
                include: {
                    interviewSteps: true
                }
            }
        }
    });

    if (!position) {
        throw new Error('Position not found');
    }

    return {
        description: position.interviewFlow.description,
        interviewSteps: position.interviewFlow.interviewSteps.map(step => ({
            id: step.id,
            name: step.name,
            orderIndex: step.orderIndex
        }))
    };
};

export const getAllPositionsService = async () => {
    const positions = await prisma.position.findMany({
        include: {
            company: true
        }
    });

    return positions.map(pos => ({
        id: pos.id,
        title: pos.title,
        manager: pos.company?.name || '',
        deadline: pos.applicationDeadline,
        status: pos.status
    }));
};

export const getPositionByIdService = async (positionId: number) => {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
            company: true,
            interviewFlow: {
                include: {
                    interviewSteps: true
                }
            }
        }
    });

    if (!position) {
        return null;
    }

    return {
        id: position.id,
        title: position.title,
        company: position.company.name,
        description: position.description,
        location: position.location,
        status: position.status,
        deadline: position.applicationDeadline
    };
};
