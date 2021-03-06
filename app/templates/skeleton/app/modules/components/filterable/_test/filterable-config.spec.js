describe('The components.filterable module, ', function () {

    var $rootScope;

    beforeEach(module('components.filterable'));


    describe('has a restConfigService that', function () {

        var pageable;
        var filterableService;
        var filterableConstants;
        var restService;
        var expectedList = 'dataSet';

        beforeEach(inject(function(_filterableService_, _filterableConstants_, _$rootScope_, _$q_) {
            filterableService = _filterableService_;
            filterableConstants = _filterableConstants_;
            $rootScope = _$rootScope_;

            restService = jasmine.createSpyObj('restService', ['list']);
            restService.list.andReturn(_$q_.when(expectedList));
        }));

        it('can create a filterable object with the appropriate default values', function() {

            pageable = filterableService.makeFilterable(restService);

            expect(pageable.pageNumber).toBe(1);
            expect(pageable.pageSize).toBe(filterableConstants.pageSize);
            expect(pageable.restService).toBe(restService);
        });

        it('knows how to create a query for filtering', function() {

            pageable = filterableService.makeFilterable(restService);

            pageable.pageNumber = 5;
            pageable.pageSize = 8;

            expect(pageable.toQuery()).toEqual({ _start: (5-1) * 8, _end: 5 * 8 });
        });

        it('should request the right page on filter', function() {

            pageable = filterableService.makeFilterable(restService);

            pageable.filter(7).then(function() {
                expect(pageable.pageNumber).toBe(7);
                expect(pageable.data).toBe(expectedList);
                expect(restService.list).toHaveBeenCalledWith(pageable.toQuery());
            });

            $rootScope.$apply();
        });

        it('should stay on the same page when no page is provided', function() {

            pageable = filterableService.makeFilterable(restService);
            pageable.pageNumber = 3;

            pageable.filter().then(function() {
                expect(pageable.pageNumber).toBe(3);
                expect(pageable.data).toBe(expectedList);
                expect(restService.list).toHaveBeenCalledWith(pageable.toQuery());
            });

            $rootScope.$apply();
        });
    });

});
