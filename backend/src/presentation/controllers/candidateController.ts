import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';
import { Application } from '../../domain/models/Application';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id); // Este es el ID del candidato
        const { applicationId, currentInterviewStep } = req.body; // Recibimos applicationId y currentInterviewStep (nombre de la fase)

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        const applicationIdNumber = parseInt(applicationId);
        if (isNaN(applicationIdNumber)) {
            return res.status(400).json({ error: 'Invalid application ID format' });
        }

        // currentInterviewStep ahora es el nombre de la fase (string), no el ID
        if (!currentInterviewStep || typeof currentInterviewStep !== 'string') {
            return res.status(400).json({ error: 'Invalid currentInterviewStep format' });
        }

        const updatedApplication = await updateCandidateStage(candidateId, applicationIdNumber, currentInterviewStep);
        res.status(200).json({ message: 'Candidate stage updated successfully', data: updatedApplication });

    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message.includes('Application not found')) {
                res.status(404).json({ message: 'Application not found', error: error.message });
            } else if (error.message.includes('Interview step with name')) {
                res.status(400).json({ message: 'Invalid interview step name', error: error.message });
            } else {
                res.status(400).json({ message: 'Error updating candidate stage', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'Error updating candidate stage', error: 'Unknown error' });
        }
    }
};

export { addCandidate };
