describe('axe.runVirtualRule', function() {
	'use strict';
	const audit = axe._audit;

	beforeEach(function() {
		axe._audit = {
			data: {}
		};
	});

	afterEach(function() {
		axe._audit = audit;
	});

	it('should return null if the rule does not exist', function() {
		axe._audit.rules = [];
		assert.equal(axe.runVirtualRule('aria-roles'), null);
	});

	it('should modify the rule to not excludeHidden', function() {
		axe._audit.rules = [
			{
				id: 'aria-roles',
				excludeHidden: true,
				runSync: function() {
					return {
						id: 'aria-roles',
						nodes: []
					};
				}
			}
		];

		axe.runVirtualRule('aria-roles');
		assert.isFalse(axe._audit.rules[0].excludeHidden);
	});

	it('should call rule.runSync', function() {
		let success = false;
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function() {
					success = true;
					return {
						id: 'aria-roles',
						nodes: []
					};
				}
			}
		];

		axe.runVirtualRule('aria-roles');
		assert.isTrue(success);
	});

	it('should pass a virtual context to rule.runSync', function() {
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function(context) {
					assert.equal(typeof context, 'object');
					assert.isTrue(Array.isArray(context.include));
					assert.equal(typeof context.include[0], 'object');

					return {
						id: 'aria-roles',
						nodes: []
					};
				}
			}
		];

		axe.runVirtualRule('aria-roles');
	});

	it('should pass the virtualNode as the actualNode of the context', function() {
		const node = {};
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function(context) {
					assert.equal(context.include[0].actualNode, node);

					return {
						id: 'aria-roles',
						nodes: []
					};
				}
			}
		];

		axe.runVirtualRule('aria-roles', node);
	});

	it('should pass through options to rule.runSync', function() {
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function(context, options) {
					assert.equal(options.foo, 'bar');

					return {
						id: 'aria-roles',
						nodes: []
					};
				}
			}
		];

		axe.runVirtualRule('aria-roles', null, { foo: 'bar' });
	});

	it('should pass the results of rule.runSync to axe.utils.publishMetaData', function() {
		const publishMetaData = axe.utils.publishMetaData;
		axe.utils.publishMetaData = function(results) {
			assert.isTrue(results);
		};
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function() {
					return true;
				}
			}
		];

		axe.runVirtualRule('aria-roles');
		axe.utils.publishMetaData = publishMetaData;
	});

	it('should return the results of rule.runSync', function() {
		const publishMetaData = axe.utils.publishMetaData;
		axe.utils.publishMetaData = function() {};
		axe._audit.rules = [
			{
				id: 'aria-roles',
				runSync: function() {
					return true;
				}
			}
		];

		assert.isTrue(axe.runVirtualRule('aria-roles'));
		axe.utils.publishMetaData = publishMetaData;
	});
});