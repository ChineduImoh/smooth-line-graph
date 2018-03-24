import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphSmooth } from '../../examples/smooth';

describe('<LineGraphSmooth />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/smooth.svg'), 'utf-8');
    });

    it('should render a graph with smooth lines', () => {
        expect(renderToString(<LineGraphSmooth />)).to.equal(result);
    });
});


