import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projectsStorage, draftsStorage } from '../services/storage.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectsStorage.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await projectsStorage.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const project = {
      id: uuidv4(),
      ...req.body,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await projectsStorage.create(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await projectsStorage.update(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const success = await projectsStorage.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save draft
router.post('/drafts', async (req, res) => {
  try {
    const draft = {
      id: req.body.id || uuidv4(),
      ...req.body,
      savedAt: new Date().toISOString()
    };

    // Check if draft exists
    const existingDraft = await draftsStorage.findById(draft.id);
    if (existingDraft) {
      await draftsStorage.update(draft.id, draft);
    } else {
      await draftsStorage.create(draft);
    }

    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get draft
router.get('/drafts/:id', async (req, res) => {
  try {
    const draft = await draftsStorage.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all drafts
router.get('/drafts', async (req, res) => {
  try {
    const drafts = await draftsStorage.findAll();
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
