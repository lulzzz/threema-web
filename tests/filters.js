describe('Filters', function() {

    let $filter;

    beforeEach(function() {

        // Load 3ema.filters module
        module('3ema.filters');

        // Inject the $filter function
        inject(function(_$filter_) {
            $filter = _$filter_;
        });

    });

    describe('markify', function() {

        this.testPatterns = (cases) => {
            const filter = $filter('markify');
            for (let testcase of cases) {
                const input = testcase[0];
                const expected = testcase[1];
                expect(filter(input)).toEqual(expected);
            };
        };

        it('detects bold text', () => {
            this.testPatterns([
                ['*bold text (not italic)*',
                 '<span class="text-bold">bold text (not italic)</span>'],
            ]);
        });

        it('detects italic text', () => {
            this.testPatterns([
                ['This text is not italic.',
                 'This text is not italic.'],
                ['_This text is italic._',
                 '<span class="text-italic">This text is italic.</span>'],
                ['This text is _partially_ italic',
                 'This text is <span class="text-italic">partially</span> italic'],
                ['This text has _two_ _italic_ bits',
                 'This text has <span class="text-italic">two</span> <span class="text-italic">italic</span> bits'],
            ]);

        });

        it('detects strikethrough text', () => {
            this.testPatterns([
                ['so ~strikethrough~', 'so <span class="text-strike">strikethrough</span>'],
            ]);
        });

        it('detects mixed markup', () => {
            this.testPatterns([
                ['*bold text with _italic_ *',
                 '<span class="text-bold">bold text with <span class="text-italic">italic</span> </span>'],
                ['*part bold,* _part italic_',
                 '<span class="text-bold">part bold,</span> <span class="text-italic">part italic</span>'],
                ['_italic text with *bold* _',
                 '<span class="text-italic">italic text with <span class="text-bold">bold</span> </span>'],
            ]);
        });

        it('is only applied on word boundaries', () => {
            this.testPatterns([
                ['so not_really_italic',
                 'so not_really_italic'],
                ['invalid*bold*stuff',
                 'invalid*bold*stuff'],
                ['no~strike~through',
                 'no~strike~through'],
                ['*bold_but_no~strike~through*',
                 '<span class="text-bold">bold_but_no~strike~through</span>'],
            ]);
        });

        it('does not break URLs', () => {
            this.testPatterns([
                ['https://en.wikipedia.org/wiki/Java_class_file *nice*',
                 'https://en.wikipedia.org/wiki/Java_class_file <span class="text-bold">nice</span>'],
                ['<a href="https://threema.ch/>_Threema_</a>',
                 '<a href="https://threema.ch/><span class="text-italic">Threema</span></a>'],
            ]);
        });

        it('ignores invalid markup', () => {
            this.testPatterns([
                ['*invalid markup (do not parse)_', '*invalid markup (do not parse)_'],
                ['random *asterisk', 'random *asterisk'],
            ]);
        });

    });
});
