import { db } from '../models/index.js'
import { Op } from 'sequelize'

export class BoardService {
    async foundAllBoard() {
        try {
            const allBoard = await db.Board.findAndCountAll() // 모델인스턴스의 배열 반환

            if (allBoard.count > 0) {
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
        } catch (err) {
            throw err
        }
    }

    async searchList(query) {
        try {
            const sort = query.sort
            let sortOrder

            if (sort === 'date_asc') sortOrder = ['createdAt', 'ASC']
            else if (sort === 'date_desc') sortOrder = ['createdAt', 'DESC']
            else if (sort === 'likes_asc') sortOrder = ['board_like', 'ASC']
            else if (sort === 'likes_desc') sortOrder = ['board_like', 'DESC']
            else if (sort === 'views_asc') sortOrder = ['board_view', 'ASC']
            else if (sort === 'view_desc') sortOrder = ['board_view', 'DESC']
            else {
                return {
                    result: false,
                    message: '잘못된 정렬 방식',
                    data: null,
                }
            }

            const searchedBoard = await db.Board.findAndCountAll({
                where: {
                    board_title: {
                        [Op.substring]: query.q, // title에 검색어 포함 여부 확인
                    },
                },
                order: [sortOrder], // 정렬 방식
            })

            if (searchedBoard.count > 0) {
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
        } catch (err) {
            throw err
        }
    }

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
                    message: '게시글 저장 성공',
                }
            } else {
                return {
                    result: false,
                    message: '게시글 저장 실패',
                }
            }
        } catch (err) {
            throw err
        }
    }

    async getOriginalBoardById(boardId) {
        // 게시글 수정을 위해 게시글 원본 반환
        try {
            const original = await db.Board.findOne({
                where: { board_id: boardId },
            }) // 반환객체 : Board{ dataValues: {}, _previousDataValues: {}, ... }

            // console.log(original.dataValues)

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
            const foundBoard = await db.Board.findOne({
                where: { board_id: boardId },
            })

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
                return {
                    result: false,
                    message: '페이지 조회 오류',
                    data: null,
                }
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