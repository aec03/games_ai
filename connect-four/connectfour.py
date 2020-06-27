import random

class ConnectFour:
    """ represents a connect-four board"""
    def __init__(self, first_move='human'):
        self.board = [' ' for i in range(49)]
        self.board_hist = {}
        self.human = 'X'
        self.comp = 'O'
        self.scores = {
            'x win': -100,
            'x three': -50,
            'x two': -10,
            'tie': 0,
            'o two': 10,
            'o three': 20,
            'o win': 500,
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
        if first_move == 'human':
            self.move = self.human
        else:
            self.move = self.comp

    def VERTICAL_COMBOS(self, move):
        move = move % 7
        return [(k, k + 7, k + 14, k + 21) for k in range(move, 28, 7)]

    def HORIZONTAL_COMBOS(self, move):
        move = int(move / 7)
        return [(k, k + 1, k + 2, k + 3) for k in range(7 * move, 7 * move + 4)]

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
        return self.comp, int

    def make_move(self):
        if self.move == self.human:
            self.print_board()
            player, move = self.human_move()

        

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