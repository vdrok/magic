import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TemplateQuestionaryModal from '../TemplateQuestionaryModalComponent.mob';

it('It renders correctly', () => {
    const tree = renderer.create(
        <TemplateQuestionaryModal
            closeCallback={() => {}}
            template={{
                name: 'cool template'
            }}
        />
    )
});