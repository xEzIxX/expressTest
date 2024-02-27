import { db } from '../models/index.js'
import { Op } from 'sequelize'

export class BoardService {
    async findAllBoard() {
        const allBoard = await db.Board.findAndCountAll() // 모델인스턴스의 배열 반환

        if (allBoard.count >= 0) {
            return {
                result: true,
                message: '게시글 조회 성공',
                data: allBoard.rows,
            }
        } else {
            return {
                result: false,
                message: '게시글 조회 실패',
                data: null,
            }
        }
    }

    async searchList(queryDto) {
        let sortOrder

        switch (queryDto.sort) {
            case 'date_asc':
                sortOrder = ['createdAt', 'ASC']
                break
            case 'date_desc':
            case '': // 빈문자열인 경우 최신순 정렬
                sortOrder = ['createdAt', 'DESC']
                break
            case 'likes_asc':
                sortOrder = ['board_like', 'ASC']
                break
            case 'likes_desc':
                sortOrder = ['board_like', 'DESC']
                break
            case 'views_asc':
                sortOrder = ['board_view', 'ASC']
                break
            case 'views_desc':
                sortOrder = ['board_view', 'DESC']
                break
            default:
                return {
                    result: false,
                    message: '잘못된 정렬 방식',
                    data: null,
                }
        }

        const searchedBoard = await db.Board.findAndCountAll({
            where: {
                board_title: {
                    [Op.substring]: queryDto.q, // title에 검색어 포함 여부 확인
                },
            },
            order: [sortOrder], // 정렬 방식
        })

        if (searchedBoard.count >= 0) {
            return {
                result: true,
                message: '검색된 게시글 조회 성공',
                data: searchedBoard.rows,
            }
        } else {
            return {
                result: false,
                message: '검색된 게시글 조회 실패',
                data: null,
            }
        }
    }

    async createBoard(newBoardDto) {
        // 작성한 게시글 저장

        const newBoard = await db.Board.create({
            board_title: newBoardDto.title,
            board_content: newBoardDto.content,
            board_user_id: newBoardDto.userId,
        })

        if (newBoard instanceof db.Board) {
            return {
                result: true,
                message: '게시글 저장 성공',
            }
        } else {
            return {
                result: false,
                message: '게시글 저장 실패',
            }
        }
    }

    async getOriginalById(accessCheckDto) {
        // 게시글 수정을 위해 게시글 원본 반환

        const original = await db.Board.findOne({
            where: { board_id: accessCheckDto.boardId },
        }) // 반환객체 : Board{ dataValues: {}, _previousDataValues: {}, ... }

        const isValid = Boolean(
            accessCheckDto.userId === original.dataValues.board_user_id
        )
        if (!isValid) return { result: false, message: '권한없음', data: null }

        if (original instanceof db.Board) {
            return {
                result: true,
                message: '게시글 반환 성공',
                data: original.dataValues,
            }
        } else if (original === null) {
            return {
                result: false,
                message: '게시글 반환 실패',
                data: null,
            }
        } else {
            return {
                result: false,
                message: '게시글 반환 오류',
                data: null,
            }
        }
    }

    async updateBoardById(updatedBoardDto) {
        // 수정된 게시글 데이터 저장

        const updatedRowsNum = await db.Board.update(
            {
                board_title: updatedBoardDto.title,
                board_content: updatedBoardDto.content,
            },
            {
                where: {
                    board_id: updatedBoardDto.boardId,
                },
            }
        )

        if (updatedRowsNum[0] > 0) {
            // console.log(updatedRowsNum[0], '개의 행이 업데이트 됨!')
            return { result: true, message: '수정 완료' }
        } else {
            return { result: false, message: '수정 실패' }
        }
    }

    async getBoardById(boardIdDto) {
        // 게시글 아이디와 일치하는 게시글 데이터 반환

        const foundBoard = await db.Board.findOne({
            where: { board_id: boardIdDto.boardId },
        })

        if (foundBoard instanceof db.Board) {
            return {
                result: true,
                message: '게시글 조회 성공',
                data: foundBoard,
            }
        } else if (foundBoard === null) {
            return {
                result: false,
                message: '게시글 미존재',
                data: null,
            }
        } else {
            return {
                result: false,
                message: '게시글 조회 오류',
                data: null,
            }
        }
    }

    async deleteBoardById(accessCheckDto) {
        // 게시글 아이디 accessCheckDto와 일치하는 게시글 데이터 삭제

        const board = await db.Board.findOne({
            where: { board_id: accessCheckDto.boardId },
        })

        const isValid = Boolean(board.board_user_id === accessCheckDto.userId)
        if (!isValid) return { result: false, message: '삭제 권한 없음' }

        const deletedRowNum = await db.Board.destroy({
            where: { board_id: accessCheckDto.boardId },
        }) // 반환값 : 삭제된 열의 갯수

        if (deletedRowNum > 0) {
            return { result: true, message: '삭제 성공' }
        } else {
            return { result: false, message: '삭제 실패' }
        }
    }
}
