// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';
// import { DeliveryPage } from '@/components/DeliveryPage';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

export default function ModulePage() {
    const router = useRouter();
    const params = useParams();
    const {currentModule, availableModules, modulesLoaded} = useModules();
    const {sellerId} = useCampaign();
    const [module, setModule] = useState<string | null>(null);
    useEffect(() => {
        if (params?.module) {
            setModule(Array.isArray(params.module) ? params.module[0] : params.module);
        }
    }, [params]);

    // Handle initial module validation
    useEffect(() => {
        if (modulesLoaded && module && !availableModules.includes(module)) {
            router.replace(`/api?seller_id=${sellerId}`);
        }
    }, [modulesLoaded, module, availableModules, router, sellerId]);

    if (!modulesLoaded || !module) {
        return <div>Loading application...</div>;
    }

    if (!availableModules.includes(module)) {
        return null;
    }
    return <div>{module}</div>;
}
