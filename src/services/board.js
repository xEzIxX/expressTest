import { db } from '../models/index.js'

export class BoardService {
    async createNewBoard(boardDto) {
        // 작성된 게시글 저장
        try {
            const createdResult = await db.Board.create({
                board_title: boardDto.title,
                board_content: boardDto.content,
                board_user_id: boardDto.userid,
            })

            if (createdResult instanceof db.Board) {
                return {
                    result: true,
                    message: '작성된 내용을 데이터베이스에 저장하였습니다!',
                }
            } else {
                return {
                    result: false,
                    message:
                        '작성된 내용을 데이터베이스에 저장하지 못하였습니다.',
                }
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getOriginalBoardById(boardId) {
        // 게시글 수정을 위해 게시글 원본 반환
        try {
            const original = await db.Board.findOne({
                where: { board_id: boardId },
            })

            if (original instanceof db.Board) {
                return original
            } else {
                return false
            }
        } catch (err) {
            throw err
        }
    }

    async updateBoardById(boardId, title, content) {
        // 수정된 게시글 데이터 저장
        try {
            const result = await db.Board.update(
                {
                    board_title: title,
                    board_content: content,
                },
                {
                    where: {
                        board_id: boardId,
                    },
                }
            )

            if (result[0] > 0) {
                // console.log(result[0], '개의 행이 업데이트 됨!')
                return { result: true, message: '수정 완료' }
            } else {
                return { result: false, message: '수정 실패' }
            }
        } catch (err) {
            throw err
        }
    }

    async getBoardById(boardId) {
        // 게시글 아이디 boardId와 일치하는 게시글 데이터 반환
        try {
            console.log('서비스 함수 시작')
            const foundBoard = await db.Board.findOne({
                where: { board_id: boardId },
            })

            console.log('시퀄라이즈 결과  : ', foundBoard instanceof db.Board)

            if (foundBoard instanceof db.Board) {
                return {
                    result: true,
                    message: '페이지 조회 성공',
                    data: foundBoard,
                }
            } else if (foundBoard === null) {
                return {
                    result: false,
                    message: '페이지 조회 실패',
                    data: null,
                }
            } else {
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async deleteBoardById(boardId) {
        // 게시글 아이디 boardId와 일치하는 게시글 데이터 삭제
        try {
            const deletedRowNum = await db.Board.destroy({
                where: { board_id: boardId },
            }) // 반환값 : 삭제된 열의 갯수
            // console.log('*********삭제된 열의 갯수 : ', deletedRowNum)

            if (deletedRowNum > 0) {
                return { result: true, message: '삭제 성공' }
            } else {
                return { result: false, message: '삭제 실패' }
            }
        } catch (err) {
            throw err
        }
    }
}
