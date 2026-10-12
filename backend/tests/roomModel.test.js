const Room = require('../models/Room');

describe('DevOps Room Model Schema Validation', () => {
  it('should validate valid DevOps room categories', () => {
    const validCategories = ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'];

    validCategories.forEach(category => {
      const room = new Room({
        slug: `test-${category.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        title: `Mastering ${category}`,
        short_description: `Learn ${category} fundamentals`,
        long_description_markdown: `# ${category} Course`,
        difficulty: 'Beginner',
        category: category,
        estimated_time_minutes: 20
      });

      const validationError = room.validateSync();
      expect(validationError).toBeUndefined();
    });
  });

  it('should reject invalid / unsupported category', () => {
    const room = new Room({
      slug: 'invalid-track',
      title: 'Invalid Track Room',
      short_description: 'Test invalid category',
      long_description_markdown: '# Test',
      difficulty: 'Beginner',
      category: 'UnsupportedCategory123',
      estimated_time_minutes: 20
    });

    const validationError = room.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.category).toBeDefined();
  });

  it('should reject room missing required fields', () => {
    const emptyRoom = new Room({});
    const validationError = emptyRoom.validateSync();

    expect(validationError).toBeDefined();
    expect(validationError.errors.slug).toBeDefined();
    expect(validationError.errors.title).toBeDefined();
    expect(validationError.errors.category).toBeDefined();
    expect(validationError.errors.difficulty).toBeDefined();
  });
});
