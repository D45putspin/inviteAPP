import React, { useState } from 'react';
import FloralTemplate from './FloralTemplate';
import MinimalTemplate from './MinimalTemplate';
import LuxuryTemplate from './LuxuryTemplate';
import VintageTemplate from './VintageTemplate';
import OceanTemplate from './OceanTemplate';

import EnvelopeIntro from './EnvelopeIntro';
import FloralIntro from './FloralIntro';
import MinimalIntro from './MinimalIntro';
import VintageIntro from './VintageIntro';
import OceanIntro from './OceanIntro';

export default function TemplateRenderer({ invite, isPreview = false, children }) {
    const shouldSkipIntro = isPreview && !invite.forceIntro;
    const [introDone, setIntroDone] = useState(shouldSkipIntro);
    const [prevTemplate, setPrevTemplate] = useState(invite.template);

    React.useEffect(() => {
        if (invite.template !== prevTemplate || invite.forceIntro) {
            const skipIntro = isPreview && !invite.forceIntro;
            setIntroDone(skipIntro);
            setPrevTemplate(invite.template);
        }
    }, [isPreview, invite.forceIntro, invite.template, prevTemplate]);

    const renderInnerTemplate = () => {
        switch (invite.template) {
            case 'minimal':
                return <MinimalTemplate invite={invite} isPreview={isPreview}>{children}</MinimalTemplate>;
            case 'luxury':
                return <LuxuryTemplate invite={invite} isPreview={isPreview}>{children}</LuxuryTemplate>;
            case 'vintage':
                return <VintageTemplate invite={invite} isPreview={isPreview}>{children}</VintageTemplate>;
            case 'ocean':
                return <OceanTemplate invite={invite} isPreview={isPreview}>{children}</OceanTemplate>;
            case 'floral':
            default:
                return <FloralTemplate invite={invite} isPreview={isPreview}>{children}</FloralTemplate>;
        }
    };

    const commonIntroProps = { onOpen: () => setIntroDone(true) };

    const renderIntro = () => {
        switch (invite.template) {
            case 'minimal':
                return <MinimalIntro invite={invite} {...commonIntroProps} />;
            case 'luxury':
                return <EnvelopeIntro invite={invite} {...commonIntroProps} />;
            case 'vintage':
                return <VintageIntro invite={invite} {...commonIntroProps} />;
            case 'ocean':
                return <OceanIntro invite={invite} {...commonIntroProps} />;
            case 'floral':
            default:
                return <FloralIntro invite={invite} {...commonIntroProps} />;
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: introDone ? 'var(--viewport-height, 100vh)' : 'auto' }}>
            {(!isPreview || invite.forceIntro) && !introDone && (
                <React.Fragment key={invite.forceIntro || invite.template}>
                    {renderIntro()}
                </React.Fragment>
            )}

            <div style={{
                opacity: introDone ? 1 : 0,
                transition: 'opacity 0.7s ease',
                height: '100%',
                width: '100%',
                visibility: introDone ? 'visible' : 'hidden',
                pointerEvents: introDone ? 'auto' : 'none'
            }}>
                {introDone && renderInnerTemplate()}
            </div>
        </div>
    );
}
