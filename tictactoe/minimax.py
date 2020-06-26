class Board:
    def __init__(self, choice):
        self.board = [[' ' for x in range(3)] for x in range(3)]
        if choice == 'X':
            self.computer = 'O'
            self.human = 'X'
            self.move = 0
            self.scores = {
                'X': -1,
                'O': 1,
                'tie': 0
            }
        elif choice == 'O':
            self.computer = 'X'
            self.human = 'O'
            self.move = 1
            self.scores = {
                'X': 1,
                'O': -1,
                'tie': 0
            }

    def make_move(self):
        player = self.change_turn()
        self.move = player
        if player == 0:
            return self.comp_move()
        else:
            print('Possible Moves:')
            print(self.possible_moves())
            print()
            return self.player_move()
    
    def change_turn(self):
        return (self.move + 1) % 2

    def print_board(self):
        print()
        for i in range(3):
            print(self.board[i])
        print()

    def space_is_free(self, move):
        if move == 1 and self.board[0][0] == ' ': return True
        elif move == 2 and self.board[0][1] == ' ': return True
        elif move == 3 and self.board[0][2] == ' ': return True
        elif move == 4 and self.board[1][0] == ' ': return True
        elif move == 5 and self.board[1][1] == ' ': return True
        elif move == 6 and self.board[1][2] == ' ': return True
        elif move == 7 and self.board[2][0] == ' ': return True
        elif move == 8 and self.board[2][1] == ' ': return True
        elif move == 9 and self.board[2][2] == ' ': return True
        else: return False

    def possible_moves(self):
        count = 1
        t = []
        for i in range(3):
            for j in range(3):
                if self.board[i][j] == ' ':
                    t.append(count)
                count += 1
        return t

    def comp_move(self):
        print('Computer is contemplating move...')
        scores = {
            'X': -1,
            'O': 1,
            'tie': 0
        }
        winner = self.is_winner()
        if winner != None:
            return scores[winner]
        b_score = float('-inf')
        b_move = None
        for i in self.possible_moves():
           self.insert_move(self.computer, i)
           score = self.minimax(0, False)
           self.remove_move(i)
           if score > b_score:
               b_score = score
               b_move = i

        return self.computer, b_move

    def minimax(self, depth, is_maximizing):
        scores = self.scores
        winner = self.is_winner()
        if winner != None:
            return scores[winner]
        if is_maximizing:
            b_score = float('-inf')
            for i in self.possible_moves():
                self.insert_move(self.computer, i)
                score = self.minimax(depth + 1, False)
                self.remove_move(i)
                if score > b_score:
                    b_score = score
            return b_score
        else:
            b_score = float('inf')
            for i in self.possible_moves():
                self.insert_move(self.human, i)
                score = self.minimax(depth + 1, True)
                self.remove_move(i)
                if score < b_score:
                    b_score = score
            return b_score
        
    def player_move(self):
        while True:
            move = input(f"Please select a position to place '{self.human}' (1 - 9): ")
            try:
                move = int(move)
                if move > 0 and move < 10:
                    if self.space_is_free(move):
                        return (self.human, move)
                    else: print('Sorry, space is occupied!')
                else: print('Please type a number within range!')
            except: 
                print('Please type a number!')

    def insert_move(self, player, move):
        if move == 1: self.board[0][0] = player
        elif move == 2: self.board[0][1] = player
        elif move == 3: self.board[0][2] = player
        elif move == 4: self.board[1][0] = player
        elif move == 5: self.board[1][1] = player
        elif move == 6: self.board[1][2] = player
        elif move == 7: self.board[2][0] = player
        elif move == 8: self.board[2][1] = player
        elif move == 9: self.board[2][2] = player

    def remove_move(self, move):
        if move == 1: self.board[0][0] = ' '
        elif move == 2: self.board[0][1] = ' '
        elif move == 3: self.board[0][2] = ' '
        elif move == 4: self.board[1][0] = ' '
        elif move == 5: self.board[1][1] = ' '
        elif move == 6: self.board[1][2] = ' '
        elif move == 7: self.board[2][0] = ' '
        elif move == 8: self.board[2][1] = ' '
        elif move == 9: self.board[2][2] = ' '

    def is_board_full(self):
        for i in range(3):
            for j in range(3):
                if self.board[i][j] == ' ':
                    return False
        return True
    
    def is_winner(self):
        board = self.board
        winner = None
        for i in range(3):
            if board[i][0] == board[i][1] and board[i][1] == board[i][2] and board[i][0] != ' ':
                winner = board[i][0]

        for i in range(3):
            if board[0][i] == board[1][i] and board[1][i] == board[2][i] and board[0][i] != ' ':
                winner = board[0][i]

        if board[0][0] == board[1][1] and board[1][1] == board[2][2] and board[0][0] != ' ':
            winner = board[0][0]

        if board[0][2] == board[1][1] and board[1][1] == board[2][0] and board[2][0] != ' ':
            winner = board[2][0]

        if winner == None and self.is_board_full():
            return 'tie'
        elif winner != None:
            return winner

def Game():
    print('Welcome to Tic-Tac-Toe!')
    choice = input("Choose 'X' or 'O': ").capitalize()
    b = Board(choice)

    while not (b.is_board_full()):
        if b.is_winner() == None:
            player, move = b.make_move()
            b.insert_move(player, move)
            b.print_board()
            if player == b.computer:
                print(f"Computer played an '{b.computer}' in position {move}!\n")
        else:
            winner = b.is_winner()
            print(f"{winner}'s won the game!'")
            break

        if b.is_board_full():
            print('Tie Game')

Game()