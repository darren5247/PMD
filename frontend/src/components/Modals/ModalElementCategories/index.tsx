import { FC } from 'react';
import cn from 'classnames';
import Modal from '@src/components/Modal';
import ImageNext from '@src/components/ImageNext';
import { IconFilterRed } from '@src/common/assets/icons';
import { CElementCategories } from '@src/constants';
import { EUrlsPages } from '@src/constants';
import { useRouter } from 'next/router';

interface IModalElementCategoriesProps {
  currentCategory: string;
  isOpen: boolean;
  onClose: () => void;
};

const ModalElementCategories: FC<IModalElementCategoriesProps> = ({
  currentCategory,
  isOpen,
  onClose
}): JSX.Element => {
  const router = useRouter();

  return (
    <Modal
      id='modalElements'
      onClose={onClose}
      isOpen={isOpen}
      clickOutsideEnabled={true}
      layoutClassName='w-full max-h-full mx-[20px] max-w-[400px]'
      crossClassName='w-10 h-10 top-2 right-2'
    >
      <div className='flex gap-2 py-4 pr-12 pl-5'>
        <ImageNext src={IconFilterRed} height={22} width={22} className='min-w-[22px] min-h-[22px]' />
        <p className='pt-1 text-pmdGrayDark'><strong>Choose a Category</strong></p>
      </div>
      <div className='px-3 min-[428px]:px-4 pt-4 pb-6 border-pmdGrayLight border-t max-h-screen overflow-auto text-black scrollbar'>
        {isOpen && (
          <div className='flex flex-col gap-2w-full'>
            <ul id='filterOptions' className='flex flex-col gap-3 min-w-52 text-left whitespace-nowrap list-none'>
              {CElementCategories.map((elementCategory, index) => (
                <li
                  key={index}
                  className='w-full list-none'
                  role='menuitem'
                >
                  <a
                    title={elementCategory}
                    className={cn(
                      'flex shadow-activeFilter px-3 py-2 w-full text-pmdGrayDark text-base no-underline cursor-pointer',
                      currentCategory === elementCategory && 'shadow-pmdRed !text-pmdRed cursor-text !no-underline'
                    )}
                    tabIndex={0}
                    onClick={() => {
                      currentCategory !== elementCategory && router.push(
                        EUrlsPages.ELEMENTS +
                        '?category=' + elementCategory
                      );
                      currentCategory !== elementCategory && onClose();
                    }}
                    onKeyDown={(e) => {
                      if (currentCategory !== elementCategory && (e.key === 'Enter' || e.key === ' ')) {
                        router.push(
                          EUrlsPages.ELEMENTS +
                          '?category=' + elementCategory
                        );
                        onClose();
                      }
                    }}
                  >
                    {elementCategory}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal >
    // <Modal
    //   id='modalElements'
    //   onClose={onClose}
    //   isOpen={isOpen}
    //   clickOutsideEnabled={true}
    //   layoutClassName='w-full h-auto max-h-screen overflow-hidden mx-[20px] max-w-[370px]'
    //   crossClassName='w-10 h-10 top-2 right-2'
    // >
    //   <div className='flex gap-2 py-4 pr-12 pl-5'>
    //     <p className='text-pmdGrayDark text-xl'><strong>Choose a Category</strong></p>
    //   </div>
    //   <div className='px-4 pt-4 pb-4 border-pmdGrayLight border-t overflow-auto scrollbar'>
    //     <ul className='flex flex-col justify-center items-center gap-0 border-pmdGray border-x border-t align-middle list-none'>
    //       {CElementCategories.map((category) => (
    //         <li
    //           key={category}
    //           title={category}
    //           className='w-full list-none'
    //           role='menuitem'
    //         >
    //           <Link
    //             href={(
    //               EUrlsPages.ELEMENTS +
    //               '?category=' + category
    //             )}
    //             onClick={onClose}
    //             onKeyDown={(e) => {
    //               if (e.key === 'Enter' || e.key === ' ') {
    //                 onClose();
    //               }
    //             }}
    //           >
    //             <a
    //               title={category}
    //               className={cn(
    //                 'w-full text-xl font-bold bg-pmdGrayLight hover:bg-pmdGrayBright active:bg-pmdGrayDark active:text-white focus:bg-pmdGray px-3 py-2 cursor-pointer text-black border-b border-pmdGray ',
    //                 currentCategory === category ? '!bg-pmdGrayDark !text-white cursor-default' : ''
    //               )}
    //             >
    //               {category}
    //             </a>
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </Modal >
  );
};

export default ModalElementCategories;
