import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphArrows } from '../../examples/arrows';

describe('<LineGraphArrows />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/arrows.svg'), 'utf-8');
    });

    it('should render a graph with arrows', () => {
        expect(renderToString(<LineGraphArrows />)).to.equal(result);
    });
});

