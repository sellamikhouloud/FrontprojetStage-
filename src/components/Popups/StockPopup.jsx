import PageHeader from '../Navigation,Pageheader/PageHeader';
import Button from '../Button/Button';
import Edit from '../../assets/Edit 2.svg';
import { Plus } from 'lucide-react';

const products = [
  { title: 'Lait', quantity: 38, unit: 'boîtes' },
  { title: 'Céréales', quantity: 38, unit: 'Kg' },
  { title: 'Huile', quantity: 6, unit: 'Litres' },
  { title: 'Sucre', quantity: 38, unit: 'Kg' },
  { title: 'Sel iodé', quantity: 7, unit: 'Kg' },
  { title: 'Légumineuses', quantity: 7, unit: 'Kg' },
  { title: 'Farine de blé', quantity: 7, unit: 'Kg' },
  { title: 'Pâtes alimentaires', quantity: 7, unit: 'Kg' },
];

const StockPopup = ({ onClose }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#9A9A9A80] p-4'>
      <div
        className='
          w-full
          max-w-[550px]
          rounded-[20px]
          bg-white
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          px-5
          py-4
        '
      >
        <PageHeader
          leftTitle='Fermer'
          showRight={false}
          onBack={onClose}
        />

        <h2 className='text-center text-[20px] font-semibold mt-0 mb-4 text-[#202124]'>
          Stock de produits
        </h2>

        <div className='space-y-1.5'>
          {products.map((product) => (
            <div
              key={product.title}
              className='
                h-[40px]
                border
                border-[#84D6D0]
                rounded-[12px]
                px-3
                flex
                items-center
                justify-between
              '
            >
              <span className='text-[15px] font-medium text-[#202124]'>
                {product.title}
              </span>

              <div className='flex items-center gap-2'>
                <div className='flex items-end gap-1'>
                  <span className='text-[#4E9F8A] text-[15px] font-bold leading-none'>
                    {product.quantity}
                  </span>

                  <span className='text-[14px] text-[#202124] leading-none'>
                    {product.unit}
                  </span>
                </div>

                <button
                  className='
                    w-6
                    h-6
                    rounded-[8px]
                    bg-[#8CCDC0]
                    hover:bg-[#74C3B2]
                    transition
                    flex
                    items-center
                    justify-center
                    shrink-0
                  '
                >
                  <Plus
                    size={14}
                    strokeWidth={3}
                    color='white'
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-4'>
          <Button
            title="Modifier les seuils d'alertes nutritionnelles"
            variant='modifier'
            icon={Edit}
            noWrapperPadding={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StockPopup;