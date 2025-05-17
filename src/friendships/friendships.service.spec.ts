import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipsService } from './friendships.service';
import { DatabaseService } from '../database/database.service';
import { Friend } from './interface/friend.interface';

describe('FriendshipsService', () => {
  let service: FriendshipsService;
  let dbService: DatabaseService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipsService,
        { provide: DatabaseService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<FriendshipsService>(FriendshipsService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('areUsersAlreadyFriends', () => {
    it('should return true if users are already friends', async () => {
      mockDbService.query.mockResolvedValueOnce({ rowCount: 1 });

      const result = await service.areUsersAlreadyFriends(1, 2);

      expect(result).toBe(true);
      expect(mockDbService.query).toHaveBeenCalledWith(
        `SELECT 1 FROM friendships WHERE user_id = $1 AND friend_id = $2`,
        [1, 2],
      );
    });

    it('should return false if users are not friends', async () => {
      mockDbService.query.mockResolvedValueOnce({ rowCount: 0 });

      const result = await service.areUsersAlreadyFriends(1, 3);

      expect(result).toBe(false);
    });
  });

  describe('getFriends', () => {
    it('should return a list of friends', async () => {
      const mockFriends: Friend[] = [
        { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' },
        { id: 3, first_name: 'Bob', last_name: 'Smith', email: 'bob@example.com' },
      ];

      mockDbService.query.mockResolvedValueOnce({ rows: mockFriends });

      const result = await service.getFriends(1);

      expect(result).toEqual(mockFriends);
      expect(mockDbService.query).toHaveBeenCalledWith(
        `SELECT u.id, u.first_name, u.last_name, u.email
       FROM friendships f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = $1`,
        [1],
      );
    });
  });
});
