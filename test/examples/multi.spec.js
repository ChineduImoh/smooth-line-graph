import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphMulti } from '../../examples/multi';

describe('<LineGraphMulti />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/multi.svg'), 'utf-8');
    });

    it('should render a graph with multiple lines', () => {
        expect(renderToString(<LineGraphMulti />)).to.equal(result);
    });
});

