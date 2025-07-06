import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  description: string;
  btnLabel: string;
  isPending?: boolean;
  handleConfirm: () => void;
};

const Confirmation = ({
  isOpen,
  toggle,
  title,
  description,
  btnLabel,
  isPending = false,
  handleConfirm,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className={`rounded-[5px] w-full sm:w-[390px] p-6 flex flex-col gap-6`}
      >
        <DialogHeader
          className={`flex flex-col gap-2 justify-center items-center`}
        >
          <h5 className="heading-5 text-center">{title}</h5>

          <p className="paragraph-2 text-black-700 text-center w-[278px]">
            {description}
          </p>
        </DialogHeader>

        <div className="flex items-center justify-end gap-4 mt-4">
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={toggle}
            disabled={isPending}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            size={"lg"}
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full whitespace-pre-wrap"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              btnLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Confirmation;
