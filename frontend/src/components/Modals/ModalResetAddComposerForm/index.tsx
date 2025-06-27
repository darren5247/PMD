import { FC } from "react";
import Modal from "@src/components/Modal";
import ImageNext from "@src/components/ImageNext";
import { IconDelete } from "@src/common/assets/icons";

interface IModalResetAddComposerFormProps {
  handleClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ModalResetAddComposerForm: FC<IModalResetAddComposerFormProps> = ({
  handleClear,
  isOpen,
  onClose,
}): JSX.Element => {
  return (
    <Modal
      id="modalResetAddComposerForm"
      onClose={onClose}
      isOpen={isOpen}
      clickOutsideEnabled={true}
      layoutClassName="w-full mx-[20px] max-w-[350px]"
      crossClassName="w-10 h-10 top-2 right-2"
    >
      <div className="flex gap-2 py-4 pr-12 pl-5">
        <ImageNext src={IconDelete} height={22} width={22} />
        <p className="pt-1 text-pmdGrayDark">
          <strong>Reset Form</strong>
        </p>
      </div>
      <div className="px-4 pt-3 pb-5 border-pmdGrayLight border-t max-h-[500px] overflow-auto text-pmdGrayDark scrollbar">
        <p>
          Clicking <strong>Reset</strong> below will clear all fields/selections
          in this form.
        </p>
        <p className="mt-4 mb-2">
          <strong>This new composer will be lost!</strong>
        </p>
        <p className="my-4">
          <em>Are you sure you want to reset?</em>
        </p>
        <div className="flex">
          <a
            title="Reset Add a Composer Form"
            className="mx-auto w-full text-center cursor-pointer button"
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClear();
              }
            }}
            tabIndex={0}
          >
            Reset
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ModalResetAddComposerForm;
