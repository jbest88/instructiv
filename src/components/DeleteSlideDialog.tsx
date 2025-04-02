
import { useProject } from "@/contexts/ProjectContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteSlideDialog() {
  const { 
    isDeleteConfirmOpen, 
    setIsDeleteConfirmOpen,
    handleDeleteSlideConfirmed,
    handleCancelDelete
  } = useProject();

  return (
    <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Slide</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this slide? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteSlideConfirmed}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
