import { GlobeAltIcon, ScaleIcon  } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function MinoroLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-white`}>
      <GlobeAltIcon className="h-12 w-12" />
      <p className="text-[24px]" >Minoro ADV</p>
    </div>
    

    
  );
}



