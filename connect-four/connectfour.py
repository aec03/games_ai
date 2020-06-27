import random

class ConnectFour:
    """ represents a connect-four board"""
    def __init__(self, first_move='human'):
        self.board = [' ' for i in range(49)]
        self.board_hist = {}
        self.human = 'X'
        self.comp = 'O'
        self.scores = {
            'center': 20,
            'x-two': -5,
            'x-three': -100,
            'o-two': 5,
            'o-three': 15,
            'o-win': 500,
        }
        self.open_spots = {
            0: 6,
            1: 6,
            2: 6,
            3: 6,
            4: 6,
            5: 6,
            6: 6,
        }
        self.LEFT_DIAGONAL_COMBOS = [(k, k + 6, k + 12, k + 18) for j in range(3, 7) for k in range(j, 28, 7)]
        self.RIGHT_DIAGONAL_COMBOS = [(k, k + 8, k + 16, k + 24) for j in range(4) for k in range(j, 28, 7)]
        self.HORIZONTAL_COMBOS = [(k, k + 1, k + 2, k + 3) for j in range(7) for k in range(j * 7, j * 7 + 4)]
        self.VERTICAL_COMBOS = [(k, k + 7, k + 14, k + 21) for k in range(28)]
        if first_move == 'human':
            self.move = self.human
        else:
            self.move = self.comp

    def print_board(self):
        for i in range(0, 49, 7):
            print(self.board[i:i+7])
        print()

    def move_to_spot(self, move):
        return move + (self.open_spots[move] * 7)

    def possible_moves(self):
        return [self.move_to_spot(i) for i in range(7) if self.open_spots[i] != None]

    def is_available(self, move):
        """ takes move in DIMINISHED form. returns True if move is available, False otherwise """
        if self.open_spots[move] != None: return True
        return False
    
    def insert_move(self, player, move):
        """ takes move in full form """
        self.board[move] = player

        if self.open_spots[move % 7] == 0:
            self.open_spots[move % 7] = None
        else:
            self.open_spots[move % 7] -= 1

    def remove_move(self, move):
        """ takes move in full form """
        self.board[move] = ' '
        
        if self.open_spots[move % 7] == None:
            self.open_spots[move % 7] = 0
        else:
            self.open_spots[move % 7] += 1

    def human_move(self):
        while True:
            move = input('Please choose column to place peice (0-6): ')
            try:
                move = int(move)
                if move < 7 and move >= 0 and self.is_available(move):
                    return self.human, self.move_to_spot(move)
            except:
                print('Please input integer value.\n')
            else:
                print('Sorry, move is not valid!\n')

    def comp_move(self):
        print('Computer is predicting the future to outsmart you...\n')
        best_score = float('-inf')
        for move in self.possible_moves():
            self.insert_move(self.comp, move)
            score = self.minimax(0, False)
            self.remove_move(move)
            if score > best_score:
                best_score = score
                best_move = move
            
        return self.comp, best_move

    def minimax(self, depth, is_maximizing):
        if depth == 4:
            self.evaluate_board()
        if is_maximizing:
            best_score = float('-inf')
            for move in self.possible_moves():
                self.insert_move(self.comp, move)
                score = self.minimax(depth + 1, False)
                self.remove_move(move)
                if score > best_score:
                    best_score = score
            return best_score
        else:
            best_score = float('inf')
            for move in self.possible_moves():
                self.insert_move(self.comp, move)
                score = self.minimax(depth + 1, False)
                self.remove_move(move)
                if score < best_score:
                    best_score = score
            return best_score

    def evaluate_board(self):
        best_score = float('-inf')
        for move in self.possible_moves():
            self.insert_move(self.comp, move)
            score = self.calculate_score(move)
            self.remove_move(move)
            if score > best_score:
                best_score = score

        return best_score

    def calculate_score(self, move):
        """ takes move as input; gets total score of possible move """
        score = self.calculate_diagonals(move) + self.calculate_horizonals(move) + self.calculate_verticals(move)
        if move % 7 == 3: score += self.scores['center']
        return score

    def calculate_diagonals(self, move):
        score = 0
        for combo in self.LEFT_DIAGONAL_COMBOS:
            t = self.make_board_tuple(combo)
            if move in combo:
                if t.count('O') == 2 and t.count(' ') == 2:
                    score += self.scores['o-two']
                elif t.count('O') == 3 and t.count(' ') == 1:
                    score += self.scores['o-three']
                elif t.count('O') == 4:
                    score += self.scores['o-win']
            else:
                if t.count('X') == 2 and t.count(' ') == 2:
                    score += self.scores['x-two']
                elif t.count('X') == 3 and t.count(' ') == 1:
                    score += self.scores['x-three']

        for combo in self.RIGHT_DIAGONAL_COMBOS:
            t = self.make_board_tuple(combo)
            if move in combo:
                if t.count('O') == 2 and t.count(' ') == 2:
                    score += self.scores['o-two']
                elif t.count('O') == 3 and t.count(' ') == 1:
                    score += self.scores['o-three']
                elif t.count('O') == 4:
                    score += self.scores['o-win']
            else:
                if t.count('X') == 2 and t.count(' ') == 2:
                    score += self.scores['x-two']
                elif t.count('X') == 3 and t.count(' ') == 1:
                    score += self.scores['x-three']

        return score

    def calculate_horizonals(self, move):
        score = 0
        for combo in self.HORIZONTAL_COMBOS:
            t = self.make_board_tuple(combo)
            if move in combo:
                if t.count('O') == 2 and t.count(' ') == 2:
                    score += self.scores['o-two']
                elif t.count('O') == 3 and t.count(' ') == 1:
                    score += self.scores['o-three']
                elif t.count('O') == 4:
                    score += self.scores['o-win']
            else:
                if t.count('X') == 2 and t.count(' ') == 2:
                    score += self.scores['x-two']
                elif t.count('X') == 3 and t.count(' ') == 1:
                    score += self.scores['x-three']

        return score

    def calculate_verticals(self, move):
        for combo in self.VERTICAL_COMBOS:
            t = self.make_board_tuple(combo)
            if move in combo:
                if t.count('O') == 2 and t.count(' ') == 2:
                    score += self.scores['o-two']
                elif t.count('O') == 3 and t.count(' ') == 1:
                    score += self.scores['o-three']
                elif t.count('O') == 4:
                    score += self.scores['o-win']
            else:
                if t.count('X') == 2 and t.count(' ') == 2:
                    score += self.scores['x-two']
                elif t.count('X') == 3 and t.count(' ') == 1:
                    score += self.scores['x-three']

        return score

    def make_board_tuple(self, combo):
        a, b, c, d = combo
        return (self.board[a], self.board[b], self.board[c], self.board[d])

    def make_move(self):
        if self.move == self.human:
            self.print_board()
            player, move = self.human_move()
        else:
            player, move = self.comp_move()

        self.insert_move(player, move)

def Game():
    print('Welcome to Connect Four!')
    while True:
        n = input('Do you want to go first (y/n)? ').lower()
        if n == 'y' or n == 'yes':
            choice = 'human'
            break
        elif n == 'n' or n == 'no':
            choice = 'comp'
            break
        else:
            print('Sorry, your preference was unclear!')
    print()
    c = ConnectFour(choice)

    while True:
        c.make_move()


Game()