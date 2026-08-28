'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Task } from '@/types/database.types';
import { useTasks } from '@/context/TaskContext';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function DeleteConfirmModal({ isOpen, onClose, task }: DeleteConfirmModalProps) {
  const { deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!task) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    const res = await deleteTask(task.id);
    setIsDeleting(false);

    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Quest"
      description="This action cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-slate-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Are you sure you want to delete <strong className="font-semibold">&quot;{task.title}&quot;</strong>? Any XP gained will be adjusted accordingly.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDelete}>
            Delete Quest
          </Button>
        </div>
      </div>
    </Modal>
  );
}
