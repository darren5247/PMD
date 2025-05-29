import { CheckIcon } from '@src/components/CheckIcon';

interface PricingCardProps {
    title: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
    priceId: string;
    isCurrentPlan?: boolean;
    currentPlanInterval?: 'month' | 'year';
    onSubscribe: (priceId: string) => void;
    onUpgrade: (priceId: string) => void;
    onDowngrade: (priceId: string) => void;
    loading?: boolean;
}

export const PricingCard = ({
    title,
    price,
    interval,
    features,
    priceId,
    isCurrentPlan,
    currentPlanInterval,
    onSubscribe,
    onUpgrade,
    onDowngrade,
    loading
}: PricingCardProps) => {
    const getButtonConfig = () => {
        if (!isCurrentPlan && currentPlanInterval) {
            if (interval === 'year' && currentPlanInterval === 'month') {
                return {
                    text: loading ? 'Processing selection...' : 'Change to Yearly',
                    handler: () => onUpgrade(priceId),
                    className: 'bg-blue-500 hover:bg-blue-600'
                };
            }
            if (interval === 'month' && currentPlanInterval === 'year') {
                return {
                    text: loading ? 'Processing selection...' : 'Change to Monthly',
                    handler: () => onDowngrade(priceId),
                    className: 'bg-yellow-500 hover:bg-yellow-600'
                };
            }
        }
        if (isCurrentPlan) {
            if (currentPlanInterval === 'month') {
                return {
                    text: 'Current Plan is Monthly',
                    handler: () => { },
                    className: 'disabled:opacity-50 disabled:bg-green-500 disabled:text-white'
                };
            }
            if (currentPlanInterval === 'year') {
                return {
                    text: 'Current Plan is Yearly',
                    handler: () => { },
                    className: 'disabled:opacity-50 disabled:bg-green-500 disabled:text-white'
                };
            }
        }
        return {
            text: loading ? 'Processing...' : ('Subscribe' + (interval === 'year' ? ' Yearly' : interval === 'month' ? ' Monthly' : '')),
            handler: () => onSubscribe(priceId),
            className: ''
        };
    };

    const buttonConfig = getButtonConfig();

    return (
        <div className='flex flex-col justify-center items-center gap-y-8 bg-white shadow-elementCard px-8 py-10 rounded-lg min-w-[244px] max-w-[244px] text-center'>
            <h3 className='flex justify-center items-center px-4 !text-2xl text-center'><strong>{title}</strong></h3>
            <p className='flex justify-center items-center mt-2 mb-1 px-3 text-sm'>
                <span><strong>${price}</strong></span>
                <span className='ml-1 text-pmdGray'>/{interval}</span>
            </p>
            <ul className='flex flex-col items-start space-y-4 py-4 w-full'>
                {features.map((feature) => (
                    <li key={feature} className='flex items-center'>
                        <CheckIcon className='w-5 h-5' />
                        <span className='ml-3'>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                aria-label='Subscribe'
                onClick={buttonConfig.handler}
                disabled={loading || isCurrentPlan}
                className={`button !leading-6 w-full text-center ${buttonConfig.className}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        buttonConfig.handler();
                    }
                }}
                tabIndex={0}
            >
                {buttonConfig.text}
            </button>
        </div>
    );
};